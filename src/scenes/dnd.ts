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
  SceneLoader,
  AbstractMesh,
} from "@babylonjs/core";
import type { SceneApi, SceneDefinition } from "../types";
import { Controls } from "../controls";
import { brand } from "../brand";

const dndDef: SceneDefinition = {
  id: "dnd",
  title: "Stage Presence — D&D Encounter",
  subtitle: "Tavern → dungeon · productization punchline",
  placeholder: true,
  options: [
    {
      id: "room",
      label: "Room",
      choices: [
        { value: "tavern", label: "The Prancing Pony" },
        { value: "dungeon", label: "Dungeon (combat)" },
      ],
      default: "tavern",
    },
    {
      id: "tokens",
      label: "Combat tokens",
      choices: [
        { value: "off", label: "Hidden" },
        { value: "on", label: "Visible" },
      ],
      default: "off",
    },
  ],
  build(engine: Engine): SceneApi {
    const canvas = engine.getRenderingCanvas() as HTMLCanvasElement;
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.04, 0.02, 0.06, 1);
    scene.collisionsEnabled = true;

    const ambient = new HemisphericLight("amb", new Vector3(0, 1, 0), scene);
    ambient.intensity = 0.3;

    // Two rooms side-by-side, separated by a wall with a doorway
    // Tavern at z<0, dungeon at z>0
    // Floor split
    const tavernFloor = MeshBuilder.CreateBox("tavernFloor", { width: 14, depth: 14, height: 0.2 }, scene);
    tavernFloor.position.set(0, 0, -8);
    const woodPlankMat = new PBRMaterial("woodFloor", scene);
    woodPlankMat.albedoColor = new Color3(0.32, 0.18, 0.08);
    woodPlankMat.roughness = 0.88;
    tavernFloor.material = woodPlankMat;
    tavernFloor.checkCollisions = true;

    const dungeonFloor = MeshBuilder.CreateBox("dungeonFloor", { width: 14, depth: 14, height: 0.2 }, scene);
    dungeonFloor.position.set(0, 0, 8);
    const stoneFloorMat = new PBRMaterial("stoneFloor", scene);
    stoneFloorMat.albedoColor = new Color3(0.28, 0.26, 0.3);
    stoneFloorMat.roughness = 0.95;
    dungeonFloor.material = stoneFloorMat;
    dungeonFloor.checkCollisions = true;

    // Outer walls
    const wallMat = new PBRMaterial("walls", scene);
    wallMat.albedoColor = new Color3(0.22, 0.18, 0.14);
    wallMat.roughness = 0.92;
    const dwallMat = new PBRMaterial("dwalls", scene);
    dwallMat.albedoColor = new Color3(0.18, 0.18, 0.22);
    dwallMat.roughness = 0.95;

    const mkWall = (
      w: number, d: number, x: number, y: number, z: number,
      mat: PBRMaterial,
    ) => {
      const wall = MeshBuilder.CreateBox(`w_${x}_${y}_${z}_${w}`, { width: w, depth: d, height: 4 }, scene);
      wall.position.set(x, y, z);
      wall.material = mat;
      wall.checkCollisions = true;
      return wall;
    };
    // tavern
    mkWall(14, 0.2, 0, 2, -15, wallMat); // back
    mkWall(0.2, 14, -7, 2, -8, wallMat); // left
    mkWall(0.2, 14, 7, 2, -8, wallMat); // right
    // dungeon
    mkWall(14, 0.2, 0, 2, 15, dwallMat); // back
    mkWall(0.2, 14, -7, 2, 8, dwallMat);
    mkWall(0.2, 14, 7, 2, 8, dwallMat);
    // shared wall with doorway in middle (z=-1 to 1 hole)
    mkWall(5.5, 0.2, -4.25, 2, 0, wallMat); // left of door
    mkWall(5.5, 0.2, 4.25, 2, 0, wallMat); // right of door

    // Tavern: bar, tables, lantern light
    const bar = MeshBuilder.CreateBox("bar", { width: 8, depth: 1, height: 1.1 }, scene);
    bar.position.set(0, 0.55, -13);
    bar.material = woodPlankMat;
    bar.checkCollisions = true;

    const woodMat = new PBRMaterial("wood", scene);
    woodMat.albedoColor = new Color3(0.18, 0.1, 0.05);
    woodMat.roughness = 0.85;
    for (let i = 0; i < 3; i++) {
      const tbl = MeshBuilder.CreateCylinder(`tbl${i}`, { height: 0.05, diameter: 1.4 }, scene);
      tbl.position.set(-3 + i * 3, 0.85, -8 + (i % 2) * 2);
      tbl.material = woodMat;
      tbl.checkCollisions = true;
      const leg = MeshBuilder.CreateCylinder(`leg${i}`, { height: 0.85, diameter: 0.18 }, scene);
      leg.position.set(tbl.position.x, 0.43, tbl.position.z);
      leg.material = woodMat;
    }

    const lantern = new PointLight("lantern", new Vector3(0, 3, -8), scene);
    lantern.diffuse = new Color3(1, 0.65, 0.3);
    lantern.intensity = 18;
    lantern.range = 14;

    // Dungeon: chains, brazier, encounter grid
    const brazier = MeshBuilder.CreateCylinder("braz", { height: 0.4, diameterTop: 0.9, diameterBottom: 0.5 }, scene);
    brazier.position.set(0, 0.7, 8);
    const ironMat = new PBRMaterial("iron", scene);
    ironMat.albedoColor = new Color3(0.1, 0.08, 0.08);
    ironMat.metallic = 0.6;
    ironMat.roughness = 0.5;
    brazier.material = ironMat;
    const flame = MeshBuilder.CreateSphere("flame", { diameter: 0.5 }, scene);
    flame.position.set(0, 1.15, 8);
    const flameMat = new StandardMaterial("flameMat", scene);
    flameMat.emissiveColor = new Color3(1, 0.55, 0.2);
    flame.material = flameMat;
    const brazierLight = new PointLight("brazL", new Vector3(0, 1.5, 8), scene);
    brazierLight.diffuse = new Color3(1, 0.45, 0.15);
    brazierLight.intensity = 22;
    brazierLight.range = 16;

    // Encounter grid (5x5 outlined squares on the floor in dungeon)
    const gridMeshes: Mesh[] = [];
    function clearTokens() {
      gridMeshes.forEach(m => m.dispose());
      gridMeshes.length = 0;
    }
    function buildTokens() {
      clearTokens();
      const tokenMat = new StandardMaterial("tokenMat", scene);
      tokenMat.diffuseColor = brand.pink;
      tokenMat.emissiveColor = brand.pink.scale(0.4);
      const enemyMat = new StandardMaterial("enemyMat", scene);
      enemyMat.diffuseColor = new Color3(0.95, 0.85, 0.2);
      enemyMat.emissiveColor = new Color3(0.4, 0.3, 0.05);
      const positions: [number, number, StandardMaterial][] = [
        [-2, 6, tokenMat],
        [-1, 7, tokenMat],
        [0, 6, tokenMat],
        [2, 10, enemyMat],
        [1, 11, enemyMat],
        [-2, 11, enemyMat],
      ];
      for (const [x, z, mat] of positions) {
        const tok = MeshBuilder.CreateCylinder(`tok_${x}_${z}`, { height: 0.06, diameter: 0.85 }, scene);
        tok.position.set(x, 0.16, z);
        tok.material = mat;
        gridMeshes.push(tok);
      }
    }

    // Async model loads — Low Poly Tavern Interior + Game-Ready Dungeon Room (both CC-BY, Sketchfab)
    const tavernPlaceholders: Mesh[] = [bar];
    let tavernModelMeshes: AbstractMesh[] = [];
    let dungeonModelMeshes: AbstractMesh[] = [];

    void SceneLoader.ImportMeshAsync("", "/models/dnd/", "tavern.glb", scene).then(result => {
      tavernModelMeshes = result.meshes;
      const root = result.meshes[0];
      root.position.set(0, 0.1, -8);
      root.scaling.set(0.8, 0.8, 0.8);
      tavernPlaceholders.forEach(m => { m.isVisible = false; });
    }).catch(err => console.warn("dnd: tavern model load failed", err));

    void SceneLoader.ImportMeshAsync("", "/models/dnd/", "dungeon.glb", scene).then(result => {
      dungeonModelMeshes = result.meshes;
      const root = result.meshes[0];
      root.position.set(0, 0.1, 8);
      root.scaling.set(0.8, 0.8, 0.8);
    }).catch(err => console.warn("dnd: dungeon model load failed", err));

    void tavernModelMeshes; void dungeonModelMeshes;

    // Brand placeholder marker (between rooms)
    const marker = MeshBuilder.CreateBox("marker", { width: 0.25, height: 1.4, depth: 0.25 }, scene);
    marker.position.set(0, 0.7, -2);
    const markerMat = new StandardMaterial("markerMat", scene);
    markerMat.diffuseColor = brand.pink;
    markerMat.emissiveColor = brand.pink.scale(0.4);
    marker.material = markerMat;

    function applyRoom(kind: string) {
      if (kind === "tavern") {
        // teleport camera into tavern
        controls.camera.position.set(0, 1.7, -6);
        controls.camera.setTarget(new Vector3(0, 1.7, -10));
      } else {
        controls.camera.position.set(0, 1.7, 5);
        controls.camera.setTarget(new Vector3(0, 1.7, 10));
      }
    }

    function applyTokens(kind: string) {
      if (kind === "on") buildTokens();
      else clearTokens();
    }

    const controls = new Controls(scene, canvas, new Vector3(0, 1.7, -6), new Vector3(0, 1.7, -10));

    scene.onBeforeRenderObservable.add(() => {
      const dt = engine.getDeltaTime() / 1000;
      controls.tick(engine, dt);
    });

    function applyOption(id: string, value: string) {
      if (id === "room") applyRoom(value);
      else if (id === "tokens") applyTokens(value);
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

export default dndDef;
