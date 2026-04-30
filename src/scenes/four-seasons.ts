import {
  Engine,
  Scene,
  Vector3,
  Color3,
  Color4,
  HemisphericLight,
  DirectionalLight,
  MeshBuilder,
  StandardMaterial,
  PBRMaterial,
  Texture,
  DynamicTexture,
  Mesh,
} from "@babylonjs/core";
import type { SceneApi, SceneDefinition } from "../types";
import { Controls } from "../controls";
import { brand } from "../brand";

function buildLabel(text: string, scene: Scene): Mesh {
  const dt = new DynamicTexture("label-tex", { width: 1024, height: 256 }, scene, false);
  const ctx = dt.getContext() as unknown as CanvasRenderingContext2D;
  ctx.fillStyle = "rgba(13,10,30,0.92)";
  ctx.fillRect(0, 0, 1024, 256);
  ctx.fillStyle = "#FE00B5";
  ctx.fillRect(0, 0, 12, 256);
  ctx.fillStyle = "#f5f3ff";
  ctx.font = "bold 80px -apple-system, system-ui, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 36, 128);
  dt.update(false);
  const mat = new StandardMaterial("label-mat", scene);
  mat.diffuseTexture = dt;
  mat.emissiveTexture = dt;
  mat.disableLighting = true;
  mat.backFaceCulling = false;
  const plane = MeshBuilder.CreatePlane("label", { width: 4, height: 1 }, scene);
  plane.material = mat;
  return plane;
}

const fourSeasonsDef: SceneDefinition = {
  id: "four-seasons",
  title: "Four Seasons Lake Austin",
  subtitle: "Event venue walkthrough · NXT BLD anchor",
  placeholder: true,
  options: [
    {
      id: "time-of-day",
      label: "Time of day",
      choices: [
        { value: "noon", label: "Noon (clear)" },
        { value: "golden", label: "Golden hour" },
        { value: "night", label: "Night reception" },
      ],
      default: "golden",
    },
    {
      id: "layout",
      label: "Floor layout",
      choices: [
        { value: "rounds", label: "Rounds (banquet)" },
        { value: "theater", label: "Theater rows" },
        { value: "open", label: "Open mingle" },
      ],
      default: "rounds",
    },
  ],
  build(engine: Engine): SceneApi {
    const canvas = engine.getRenderingCanvas() as HTMLCanvasElement;
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.05, 0.04, 0.12, 1);
    scene.collisionsEnabled = true;

    const sky = new HemisphericLight("sky", new Vector3(0, 1, 0), scene);
    sky.intensity = 0.6;
    const sun = new DirectionalLight("sun", new Vector3(-0.4, -1, -0.3), scene);
    sun.intensity = 1.2;

    // Ground / lawn
    const ground = MeshBuilder.CreateGround("ground", { width: 80, height: 80, subdivisions: 8 }, scene);
    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new Color3(0.08, 0.18, 0.1);
    groundMat.specularColor = Color3.Black();
    ground.material = groundMat;
    ground.checkCollisions = true;

    // Pavilion floor (raised stone-look)
    const floor = MeshBuilder.CreateBox("floor", { width: 24, depth: 16, height: 0.2 }, scene);
    floor.position.y = 0.1;
    const floorMat = new PBRMaterial("floorMat", scene);
    floorMat.albedoColor = new Color3(0.85, 0.82, 0.78);
    floorMat.roughness = 0.85;
    floorMat.metallic = 0.05;
    floor.material = floorMat;
    floor.checkCollisions = true;

    // Pavilion columns (4)
    const colMat = new PBRMaterial("colMat", scene);
    colMat.albedoColor = new Color3(0.96, 0.95, 0.92);
    colMat.roughness = 0.7;
    colMat.metallic = 0.0;
    const colPositions = [
      new Vector3(-11, 2, -7),
      new Vector3(11, 2, -7),
      new Vector3(-11, 2, 7),
      new Vector3(11, 2, 7),
    ];
    const columns: Mesh[] = colPositions.map((p, i) => {
      const c = MeshBuilder.CreateCylinder(`col${i}`, { height: 4, diameter: 0.6 }, scene);
      c.position.copyFrom(p);
      c.material = colMat;
      c.checkCollisions = true;
      return c;
    });

    // Pavilion roof
    const roof = MeshBuilder.CreateBox("roof", { width: 24, depth: 16, height: 0.3 }, scene);
    roof.position.y = 4.15;
    const roofMat = new PBRMaterial("roofMat", scene);
    roofMat.albedoColor = new Color3(0.18, 0.16, 0.18);
    roofMat.roughness = 0.85;
    roof.material = roofMat;

    // Lake (a big plane to the south)
    const lake = MeshBuilder.CreateGround("lake", { width: 100, height: 60 }, scene);
    lake.position.set(0, 0.02, -50);
    const lakeMat = new PBRMaterial("lakeMat", scene);
    lakeMat.albedoColor = new Color3(0.12, 0.28, 0.45);
    lakeMat.roughness = 0.15;
    lakeMat.metallic = 0.2;
    lake.material = lakeMat;

    // Tree placeholders (cylinders + spheres)
    for (let i = 0; i < 18; i++) {
      const ang = (i / 18) * Math.PI * 2;
      const r = 22 + (i % 3) * 4;
      const trunk = MeshBuilder.CreateCylinder(`trunk${i}`, { height: 3, diameter: 0.3 }, scene);
      trunk.position.set(Math.cos(ang) * r, 1.5, Math.sin(ang) * r + 6);
      const trunkMat = new StandardMaterial(`tm${i}`, scene);
      trunkMat.diffuseColor = new Color3(0.22, 0.15, 0.08);
      trunk.material = trunkMat;
      const leaves = MeshBuilder.CreateSphere(`leaves${i}`, { diameter: 2.4 }, scene);
      leaves.position.set(trunk.position.x, 4, trunk.position.z);
      const leavesMat = new StandardMaterial(`lm${i}`, scene);
      leavesMat.diffuseColor = new Color3(0.18, 0.32, 0.16);
      leaves.material = leavesMat;
    }

    // Layout: tables (groups). Will be rebuilt by applyOption('layout', ...)
    const layoutMeshes: Mesh[] = [];
    function clearLayout() {
      layoutMeshes.forEach(m => m.dispose());
      layoutMeshes.length = 0;
    }
    function buildLayout(kind: string) {
      clearLayout();
      const tableMat = new PBRMaterial("tableMat", scene);
      tableMat.albedoColor = new Color3(0.95, 0.93, 0.88);
      tableMat.roughness = 0.6;
      if (kind === "rounds") {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
          const t = MeshBuilder.CreateCylinder(`tbl_${r}_${c}`, { height: 0.05, diameter: 1.6 }, scene);
          t.position.set(-9 + c * 6, 1, -5 + r * 5);
          t.material = tableMat;
          t.checkCollisions = true;
          layoutMeshes.push(t);
        }
      } else if (kind === "theater") {
        for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) {
          const ch = MeshBuilder.CreateBox(`ch_${r}_${c}`, { width: 0.5, height: 0.9, depth: 0.5 }, scene);
          ch.position.set(-9.5 + c * 2.7, 0.65, -5 + r * 2);
          ch.material = tableMat;
          ch.checkCollisions = true;
          layoutMeshes.push(ch);
        }
      } else { // open mingle
        for (let i = 0; i < 6; i++) {
          const ang = (i / 6) * Math.PI * 2;
          const t = MeshBuilder.CreateCylinder(`hi_${i}`, { height: 1.1, diameter: 0.7 }, scene);
          t.position.set(Math.cos(ang) * 5, 0.55, Math.sin(ang) * 4);
          t.material = tableMat;
          t.checkCollisions = true;
          layoutMeshes.push(t);
        }
      }
    }

    // Time of day = light setup + clear color
    function applyTime(kind: string) {
      if (kind === "noon") {
        scene.clearColor = new Color4(0.62, 0.78, 0.92, 1);
        sun.diffuse = new Color3(1, 0.98, 0.92);
        sun.intensity = 1.6;
        sky.intensity = 0.9;
      } else if (kind === "golden") {
        scene.clearColor = new Color4(0.96, 0.55, 0.32, 1);
        sun.diffuse = new Color3(1, 0.72, 0.45);
        sun.intensity = 1.1;
        sky.intensity = 0.6;
      } else { // night
        scene.clearColor = new Color4(0.04, 0.05, 0.12, 1);
        sun.diffuse = new Color3(0.4, 0.45, 0.65);
        sun.intensity = 0.3;
        sky.intensity = 0.2;
      }
    }

    // Big floating placeholder label
    const label = buildLabel("FOUR SEASONS LAKE AUSTIN — placeholder", scene);
    label.position.set(0, 5.5, -2);
    label.scaling.set(2, 2, 2);

    // Brand-colored placeholder marker (pink obelisk near spawn)
    const marker = MeshBuilder.CreateBox("marker", { width: 0.3, height: 1.6, depth: 0.3 }, scene);
    marker.position.set(2.5, 0.8, 4);
    const markerMat = new StandardMaterial("markerMat", scene);
    markerMat.diffuseColor = brand.pink;
    markerMat.emissiveColor = brand.pink.scale(0.5);
    marker.material = markerMat;

    // Boundary "skirt" so player can't walk into the void
    const skirt = MeshBuilder.CreateBox("skirt", { width: 80, depth: 80, height: 0.1 }, scene);
    skirt.position.y = -0.1;
    skirt.isVisible = false;
    skirt.checkCollisions = true;

    const controls = new Controls(scene, canvas, new Vector3(0, 1.7, 8), new Vector3(0, 1.7, 0));

    scene.onBeforeRenderObservable.add(() => {
      const dt = engine.getDeltaTime() / 1000;
      controls.tick(engine, dt);
    });

    function applyOption(id: string, value: string) {
      if (id === "time-of-day") applyTime(value);
      else if (id === "layout") buildLayout(value);
    }

    // defaults applied by caller
    void Texture; // keep import for downstream extension
    void columns;

    return {
      scene,
      camera: controls.camera,
      meshes: [],
      applyOption,
      dispose() {
        controls.dispose();
        scene.dispose();
      },
    };
  },
};

export default fourSeasonsDef;
