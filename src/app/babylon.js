// Globals (externally loaded dependencies)
// jQuery
// BABYLON

import { Observable } from 'rx';

//
// Babylon driver
//
export function makeGameDriver(mountPoint, createScene) {
  const canvas = jQuery(mountPoint).get(0);
  const engine = new BABYLON.Engine(canvas, true);
  const scene = createScene(engine);
  return function gameDriver() {
    function renderScene() {
      return scene.render();
    }
    // const timeout = 5000; // milliseconds
    // setTimeout(engine.stopRenderLoop(renderScene), timeout);
    engine.runRenderLoop(renderScene);
    return Observable.just({
      scene: scene
    });
  };
}
