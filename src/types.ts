import type { Scene, AbstractMesh, FreeCamera } from "@babylonjs/core";

export type SceneId = "four-seasons" | "carol" | "dnd";

export interface SceneOption {
  id: string;
  label: string;
  choices: { value: string; label: string }[];
  default: string;
}

export interface SceneApi {
  scene: Scene;
  camera: FreeCamera;
  meshes: AbstractMesh[];
  /** Apply an option change. Called once per option at boot for defaults too. */
  applyOption(id: string, value: string): void;
  /** Tear down resources owned by this scene (called on switch). */
  dispose(): void;
}

export interface SceneDefinition {
  id: SceneId;
  title: string;
  subtitle: string;
  /** Whether this is a placeholder rendering (true for all current scenes — flips a UI note). */
  placeholder: boolean;
  options: SceneOption[];
  /** Build the scene. Engine + canvas come from caller. */
  build: (engine: import("@babylonjs/core").Engine) => SceneApi;
}
