import {
  Engine,
  Scene,
  Vector3,
  Color3,
  Color4,
  HemisphericLight,
  PointLight,
  MeshBuilder,
  StandardMaterial,
  PBRMaterial,
  Mesh,
  GlowLayer,
} from "@babylonjs/core";
import type { SceneApi, SceneDefinition } from "../types";
import { Controls } from "../controls";
import { brand } from "../brand";

const carolDef: SceneDefinition = {
  id: "carol",
  title: "A Christmas Carol — Stave 1",
  subtitle: "Scrooge's bedroom · spatial storytelling demo",
  placeholder: true,
  options: [
    {
      id: "lighting",
      label: "Lighting",
      choices: [
        { value: "gas", label: "Gas-lamp (warm)" },
        { value: "ghost", label: "Ghost-light (cold blue)" },
        { value: "ember", label: "Dying ember" },
      ],
      default: "gas",
    },
    {
      id: "fog",
      label: "Fog",
      choices: [
        { value: "off", label: "Off" },
        { value: "thin", label: "Thin haze" },
        { value: "thick", label: "Thick (London Dec 24)" },
      ],
      default: "thin",
    },
  ],
  build(engine: Engine): SceneApi {
    const canvas = engine.getRenderingCanvas() as HTMLCanvasElement;
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.02, 0.02, 0.04, 1);
    scene.collisionsEnabled = true;

    const ambient = new HemisphericLight("amb", new Vector3(0, 1, 0), scene);
    ambient.intensity = 0.18;
    ambient.groundColor = new Color3(0.05, 0.04, 0.08);

    const lamp = new PointLight("lamp", new Vector3(-2.5, 2.4, -2.5), scene);
    lamp.intensity = 30;
    lamp.range = 12;

    const glow = new GlowLayer("glow", scene);
    glow.intensity = 0.6;

    // Floorboards
    const floor = MeshBuilder.CreateBox("floor", { width: 12, depth: 12, height: 0.15 }, scene);
    floor.position.y = 0;
    const floorMat = new PBRMaterial("floor", scene);
    floorMat.albedoColor = new Color3(0.18, 0.12, 0.07);
    floorMat.roughness = 0.95;
    floor.material = floorMat;
    floor.checkCollisions = true;

    // 4 walls
    const wallMat = new PBRMaterial("wall", scene);
    wallMat.albedoColor = new Color3(0.22, 0.18, 0.16);
    wallMat.roughness = 0.92;
    const walls: Mesh[] = [];
    const mkWall = (w: number, d: number, x: number, z: number) => {
      const wall = MeshBuilder.CreateBox(`w_${x}_${z}`, { width: w, depth: d, height: 4 }, scene);
      wall.position.set(x, 2, z);
      wall.material = wallMat;
      wall.checkCollisions = true;
      walls.push(wall);
      return wall;
    };
    mkWall(12, 0.2, 0, -6);
    mkWall(12, 0.2, 0, 6);
    mkWall(0.2, 12, -6, 0);
    mkWall(0.2, 12, 6, 0);

    // Ceiling
    const ceil = MeshBuilder.CreateBox("ceil", { width: 12, depth: 12, height: 0.15 }, scene);
    ceil.position.y = 4.075;
    ceil.material = wallMat;

    // Four-poster bed
    const bedFrame = MeshBuilder.CreateBox("bedFrame", { width: 3, depth: 4.5, height: 0.4 }, scene);
    bedFrame.position.set(-2.5, 0.4, 2);
    const woodMat = new PBRMaterial("wood", scene);
    woodMat.albedoColor = new Color3(0.14, 0.08, 0.04);
    woodMat.roughness = 0.85;
    bedFrame.material = woodMat;
    bedFrame.checkCollisions = true;

    const mattress = MeshBuilder.CreateBox("mattress", { width: 2.8, depth: 4.3, height: 0.3 }, scene);
    mattress.position.set(-2.5, 0.75, 2);
    const linenMat = new PBRMaterial("linen", scene);
    linenMat.albedoColor = new Color3(0.55, 0.52, 0.46);
    linenMat.roughness = 0.95;
    mattress.material = linenMat;

    const pillow = MeshBuilder.CreateBox("pillow", { width: 1.6, depth: 0.7, height: 0.18 }, scene);
    pillow.position.set(-2.5, 1.0, 0.2);
    pillow.material = linenMat;

    // Bed posts
    for (const [px, pz] of [
      [-3.8, 0.2],
      [-1.2, 0.2],
      [-3.8, 3.8],
      [-1.2, 3.8],
    ]) {
      const post = MeshBuilder.CreateBox(`post_${px}_${pz}`, { width: 0.18, depth: 0.18, height: 3.2 }, scene);
      post.position.set(px, 1.6, pz);
      post.material = woodMat;
    }

    // Fireplace
    const fpBack = MeshBuilder.CreateBox("fpBack", { width: 2.4, depth: 0.4, height: 3.2 }, scene);
    fpBack.position.set(3.2, 1.6, -5.7);
    const stoneMat = new PBRMaterial("stone", scene);
    stoneMat.albedoColor = new Color3(0.32, 0.3, 0.28);
    stoneMat.roughness = 0.95;
    fpBack.material = stoneMat;

    const fpHole = MeshBuilder.CreateBox("fpHole", { width: 1.4, depth: 0.6, height: 1.6 }, scene);
    fpHole.position.set(3.2, 0.9, -5.5);
    const blackMat = new StandardMaterial("blk", scene);
    blackMat.diffuseColor = new Color3(0, 0, 0);
    fpHole.material = blackMat;

    // Embers (glowing pink-orange placeholder)
    const ember = MeshBuilder.CreateSphere("ember", { diameter: 0.4 }, scene);
    ember.position.set(3.2, 0.3, -5.5);
    const emberMat = new StandardMaterial("emberMat", scene);
    emberMat.emissiveColor = new Color3(0.95, 0.4, 0.1);
    emberMat.diffuseColor = new Color3(0.5, 0.2, 0.05);
    ember.material = emberMat;
    const fireLight = new PointLight("fire", new Vector3(3.2, 0.6, -5.3), scene);
    fireLight.diffuse = new Color3(1, 0.55, 0.2);
    fireLight.intensity = 8;
    fireLight.range = 6;

    // Window with cold blue light from outside
    const windowFrame = MeshBuilder.CreateBox("winFr", { width: 1.6, depth: 0.1, height: 2 }, scene);
    windowFrame.position.set(-5.92, 2.2, -2);
    windowFrame.material = woodMat;
    const windowGlass = MeshBuilder.CreateBox("winGl", { width: 1.4, depth: 0.05, height: 1.8 }, scene);
    windowGlass.position.set(-5.94, 2.2, -2);
    const winMat = new StandardMaterial("winMat", scene);
    winMat.emissiveColor = new Color3(0.25, 0.35, 0.5);
    winMat.diffuseColor = new Color3(0.05, 0.1, 0.18);
    winMat.specularColor = new Color3(0, 0, 0);
    windowGlass.material = winMat;
    const moonLight = new PointLight("moon", new Vector3(-5.5, 2.5, -2), scene);
    moonLight.diffuse = new Color3(0.3, 0.5, 0.85);
    moonLight.intensity = 4;
    moonLight.range = 8;

    // Door
    const door = MeshBuilder.CreateBox("door", { width: 1.6, depth: 0.1, height: 2.6 }, scene);
    door.position.set(0, 1.3, 5.92);
    door.material = woodMat;
    door.checkCollisions = true;

    // Brand placeholder marker
    const marker = MeshBuilder.CreateBox("marker", { width: 0.2, height: 1.2, depth: 0.2 }, scene);
    marker.position.set(0, 0.6, -2);
    const markerMat = new StandardMaterial("markerMat", scene);
    markerMat.diffuseColor = brand.pink;
    markerMat.emissiveColor = brand.pink.scale(0.4);
    marker.material = markerMat;

    function applyLighting(kind: string) {
      if (kind === "gas") {
        lamp.diffuse = new Color3(1, 0.7, 0.4);
        lamp.intensity = 30;
        ambient.diffuse = new Color3(0.85, 0.6, 0.4);
        emberMat.emissiveColor = new Color3(0.95, 0.4, 0.1);
        fireLight.intensity = 8;
      } else if (kind === "ghost") {
        lamp.diffuse = new Color3(0.4, 0.6, 1);
        lamp.intensity = 16;
        ambient.diffuse = new Color3(0.3, 0.45, 0.7);
        emberMat.emissiveColor = new Color3(0.2, 0.4, 0.7);
        fireLight.intensity = 2;
        fireLight.diffuse = new Color3(0.4, 0.55, 0.95);
      } else { // ember
        lamp.intensity = 4;
        lamp.diffuse = new Color3(0.95, 0.35, 0.12);
        ambient.diffuse = new Color3(0.25, 0.12, 0.06);
        emberMat.emissiveColor = new Color3(1, 0.55, 0.2);
        fireLight.intensity = 14;
        fireLight.diffuse = new Color3(1, 0.45, 0.15);
      }
    }
    function applyFog(kind: string) {
      if (kind === "off") {
        scene.fogMode = Scene.FOGMODE_NONE;
      } else if (kind === "thin") {
        scene.fogMode = Scene.FOGMODE_EXP;
        scene.fogDensity = 0.04;
        scene.fogColor = new Color3(0.12, 0.1, 0.13);
      } else {
        scene.fogMode = Scene.FOGMODE_EXP;
        scene.fogDensity = 0.18;
        scene.fogColor = new Color3(0.07, 0.07, 0.1);
      }
    }

    const controls = new Controls(scene, canvas, new Vector3(2, 1.7, 4), new Vector3(0, 1.5, 0));

    scene.onBeforeRenderObservable.add(() => {
      const dt = engine.getDeltaTime() / 1000;
      controls.tick(engine, dt);
    });

    function applyOption(id: string, value: string) {
      if (id === "lighting") applyLighting(value);
      else if (id === "fog") applyFog(value);
    }

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

export default carolDef;
