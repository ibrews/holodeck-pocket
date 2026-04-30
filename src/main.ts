import { Engine, WebXRDefaultExperience } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

import type { SceneApi, SceneDefinition, SceneId } from "./types";
import fourSeasonsDef from "./scenes/four-seasons";
import carolDef from "./scenes/carol";
import dndDef from "./scenes/dnd";

const SCENES: Record<SceneId, SceneDefinition> = {
  "four-seasons": fourSeasonsDef,
  "carol": carolDef,
  "dnd": dndDef,
};

// Default scene depends on the deploy context. The QR code links can pin via #scene=...
const DEFAULT_SCENE: SceneId = "four-seasons";

const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
  adaptToDeviceRatio: true,
  audioEngine: false,
});

let activeApi: SceneApi | null = null;
let activeId: SceneId | null = null;

function readSceneFromHash(): SceneId {
  const m = location.hash.match(/scene=([a-z-]+)/);
  if (m && m[1] in SCENES) return m[1] as SceneId;
  return DEFAULT_SCENE;
}

function loadScene(id: SceneId) {
  if (activeApi) {
    activeApi.dispose();
    activeApi = null;
  }
  const def = SCENES[id];
  const api = def.build(engine);
  activeApi = api;
  activeId = id;

  // apply defaults
  for (const opt of def.options) {
    api.applyOption(opt.id, opt.default);
  }

  renderUi(def);
  setupXR(api);

  // update hash without scrolling
  if (!location.hash.includes(`scene=${id}`)) {
    history.replaceState(null, "", `#scene=${id}`);
  }

  document.title = `${def.title} · Holodeck-in-a-Pocket`;
}

function renderUi(def: SceneDefinition) {
  const pills = document.getElementById("scene-pills")!;
  pills.innerHTML = "";
  (Object.keys(SCENES) as SceneId[]).forEach(id => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = SCENES[id].title.replace(" — ", " · ");
    btn.dataset.id = id;
    btn.setAttribute("aria-pressed", String(id === def.id));
    btn.addEventListener("click", () => {
      if (id !== activeId) {
        history.pushState(null, "", `#scene=${id}`);
        loadScene(id);
      }
    });
    pills.appendChild(btn);
  });

  const panel = document.getElementById("options-panel")!;
  panel.innerHTML = "";
  if (def.options.length > 0) {
    const h = document.createElement("h3");
    h.textContent = "Design options";
    panel.appendChild(h);
    for (const opt of def.options) {
      const wrap = document.createElement("div");
      wrap.className = "opt";
      const label = document.createElement("label");
      label.htmlFor = `opt-${opt.id}`;
      label.textContent = opt.label;
      const select = document.createElement("select");
      select.id = `opt-${opt.id}`;
      for (const c of opt.choices) {
        const o = document.createElement("option");
        o.value = c.value;
        o.textContent = c.label;
        if (c.value === opt.default) o.selected = true;
        select.appendChild(o);
      }
      select.addEventListener("change", () => {
        activeApi?.applyOption(opt.id, select.value);
      });
      wrap.appendChild(label);
      wrap.appendChild(select);
      panel.appendChild(wrap);
    }
  }

  const note = document.getElementById("placeholder-note");
  if (note) note.hidden = !def.placeholder;
}

async function setupXR(api: SceneApi) {
  const xrButton = document.getElementById("xr-button") as HTMLButtonElement | null;
  if (!xrButton) return;
  try {
    const xr = await WebXRDefaultExperience.CreateAsync(api.scene, {
      uiOptions: { sessionMode: "immersive-vr" },
      optionalFeatures: true,
    });
    if (xr.baseExperience) {
      xrButton.hidden = false;
      xrButton.disabled = false;
      xrButton.onclick = () => {
        xr.baseExperience.enterXRAsync("immersive-vr", "local-floor").catch(err => {
          console.warn("XR enter failed", err);
          xrButton.textContent = "VR unavailable";
          xrButton.disabled = true;
        });
      };
    } else {
      xrButton.hidden = true;
    }
  } catch (err) {
    console.info("WebXR not available", err);
    xrButton.hidden = true;
  }
}

window.addEventListener("hashchange", () => {
  const id = readSceneFromHash();
  if (id !== activeId) loadScene(id);
});

window.addEventListener("resize", () => engine.resize());

loadScene(readSceneFromHash());

engine.runRenderLoop(() => {
  if (activeApi) activeApi.scene.render();
});
