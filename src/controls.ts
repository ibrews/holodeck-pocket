import {
  FreeCamera,
  Vector3,
  Scene,
  Engine,
  Quaternion,
} from "@babylonjs/core";

const isCoarsePointer = () => matchMedia("(pointer: coarse)").matches;

/**
 * Wires desktop (WASD + mouse-look on click), touch (joystick + look-pad),
 * and exposes the FreeCamera. Camera locked at human height; physics is
 * cheap collision against environment meshes added by the scene.
 */
export class Controls {
  readonly camera: FreeCamera;
  private readonly canvas: HTMLCanvasElement;
  private moveInput = new Vector3(0, 0, 0);
  private touchYaw = 0;
  private touchPitch = 0;
  private joystickActive = false;
  private joystickRect: DOMRect | null = null;
  private detachFns: Array<() => void> = [];

  constructor(scene: Scene, canvas: HTMLCanvasElement, spawn: Vector3, lookAt: Vector3) {
    this.canvas = canvas;
    void this.canvas;
    const cam = new FreeCamera("player", spawn.clone(), scene);
    cam.setTarget(lookAt);
    cam.minZ = 0.05;
    cam.maxZ = 600;
    cam.fov = 1.05; // ~60deg
    cam.speed = 0.18;
    cam.angularSensibility = 1500;
    cam.inertia = 0.6;
    cam.checkCollisions = true;
    cam.applyGravity = false;
    cam.ellipsoid = new Vector3(0.4, 0.85, 0.4);
    cam.ellipsoidOffset = new Vector3(0, 0.85, 0);
    cam.keysUp = [87, 38];    // W, ArrowUp
    cam.keysDown = [83, 40];  // S, ArrowDown
    cam.keysLeft = [65, 37];  // A, ArrowLeft
    cam.keysRight = [68, 39]; // D, ArrowRight
    cam.attachControl(canvas, true);
    scene.collisionsEnabled = true;
    scene.gravity = new Vector3(0, -0.18, 0);

    this.camera = cam;
    this.attachTouch();
    this.attachOrientationFallback();
    this.showHintForUserType();
  }

  dispose() {
    this.detachFns.forEach(fn => fn());
    this.detachFns = [];
    this.camera.dispose();
  }

  private attachTouch() {
    const joystick = document.getElementById("joystick");
    const knob = document.getElementById("joystick-knob");
    const lookPad = document.getElementById("look-pad");
    const touchControls = document.getElementById("touch-controls");
    if (!joystick || !knob || !lookPad || !touchControls) return;

    if (!isCoarsePointer()) {
      // Hide on desktop; show only on touch devices.
      touchControls.hidden = true;
    } else {
      touchControls.hidden = false;
    }

    const onJStart = (e: PointerEvent) => {
      this.joystickActive = true;
      this.joystickRect = joystick.getBoundingClientRect();
      joystick.setPointerCapture(e.pointerId);
      this.handleJoystick(e);
    };
    const onJMove = (e: PointerEvent) => {
      if (!this.joystickActive) return;
      this.handleJoystick(e);
    };
    const onJEnd = (e: PointerEvent) => {
      this.joystickActive = false;
      this.moveInput.set(0, 0, 0);
      knob.style.transform = "";
      try { joystick.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    };
    joystick.addEventListener("pointerdown", onJStart);
    joystick.addEventListener("pointermove", onJMove);
    joystick.addEventListener("pointerup", onJEnd);
    joystick.addEventListener("pointercancel", onJEnd);
    this.detachFns.push(() => {
      joystick.removeEventListener("pointerdown", onJStart);
      joystick.removeEventListener("pointermove", onJMove);
      joystick.removeEventListener("pointerup", onJEnd);
      joystick.removeEventListener("pointercancel", onJEnd);
    });

    let lookActive = false;
    let lastX = 0;
    let lastY = 0;
    const onLStart = (e: PointerEvent) => {
      lookActive = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lookPad.setPointerCapture(e.pointerId);
    };
    const onLMove = (e: PointerEvent) => {
      if (!lookActive) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      this.touchYaw += dx * 0.005;
      this.touchPitch += dy * 0.005;
      this.touchPitch = Math.max(-1.2, Math.min(1.2, this.touchPitch));
    };
    const onLEnd = (e: PointerEvent) => {
      lookActive = false;
      try { lookPad.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    };
    lookPad.addEventListener("pointerdown", onLStart);
    lookPad.addEventListener("pointermove", onLMove);
    lookPad.addEventListener("pointerup", onLEnd);
    lookPad.addEventListener("pointercancel", onLEnd);
    this.detachFns.push(() => {
      lookPad.removeEventListener("pointerdown", onLStart);
      lookPad.removeEventListener("pointermove", onLMove);
      lookPad.removeEventListener("pointerup", onLEnd);
      lookPad.removeEventListener("pointercancel", onLEnd);
    });
  }

  private handleJoystick(e: PointerEvent) {
    if (!this.joystickRect) return;
    const cx = this.joystickRect.left + this.joystickRect.width / 2;
    const cy = this.joystickRect.top + this.joystickRect.height / 2;
    const radius = this.joystickRect.width / 2;
    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dist = Math.min(radius, Math.hypot(dx, dy));
    const ang = Math.atan2(dy, dx);
    dx = Math.cos(ang) * dist;
    dy = Math.sin(ang) * dist;
    const knob = document.getElementById("joystick-knob");
    if (knob) knob.style.transform = `translate(${dx}px, ${dy}px)`;
    // Normalize to [-1, 1]; in our world, camera-relative forward is -Z and right is +X.
    this.moveInput.x = dx / radius;
    this.moveInput.z = -dy / radius;
  }

  private attachOrientationFallback() {
    // Optional: nothing automatic — Safari requires a user-gesture permission.
    // We expose the joystick + look-pad on touch instead, which is reliable.
  }

  private showHintForUserType() {
    const hint = document.getElementById("hint");
    if (!hint) return;
    hint.textContent = isCoarsePointer()
      ? "Drag joystick to move · drag right side to look"
      : "Click canvas, WASD + mouse to look";
    hint.classList.add("show");
    setTimeout(() => hint.classList.remove("show"), 4500);
  }

  /** Called from render loop with delta-time seconds; merges touch input into camera. */
  tick(_engine: Engine, dtSec: number) {
    if (this.joystickActive && (this.moveInput.x !== 0 || this.moveInput.z !== 0)) {
      // Move along the camera's local axes, ignoring vertical pitch.
      const speed = this.camera.speed * 60 * dtSec; // matches keyboard feel
      const forward = this.camera.getDirection(Vector3.Forward());
      forward.y = 0;
      forward.normalize();
      const right = this.camera.getDirection(Vector3.Right());
      right.y = 0;
      right.normalize();
      const move = forward.scale(this.moveInput.z * speed)
        .add(right.scale(this.moveInput.x * speed));
      // FreeCamera positions itself; collisions enforced via cameraCollisionVelocity path.
      // For simplicity we add the vector and let the engine ellipsoid resolve via _collideWithWorld.
      this.camera.cameraDirection.addInPlace(move);
    }

    if (this.touchYaw !== 0 || this.touchPitch !== 0) {
      // Rotate camera by accumulated yaw/pitch then reset deltas.
      const yawQ = Quaternion.RotationAxis(Vector3.Up(), this.touchYaw);
      const pitchQ = Quaternion.RotationAxis(Vector3.Right(), this.touchPitch);
      // Babylon FreeCamera uses rotation Euler; merge by rotating local axes.
      this.camera.rotation.y += this.touchYaw;
      this.camera.rotation.x += this.touchPitch;
      this.camera.rotation.x = Math.max(-1.4, Math.min(1.4, this.camera.rotation.x));
      this.touchYaw = 0;
      this.touchPitch = 0;
      // Suppress unused warnings — quats reserved for a future XR-aligned variant.
      void yawQ; void pitchQ;
    }
  }
}
