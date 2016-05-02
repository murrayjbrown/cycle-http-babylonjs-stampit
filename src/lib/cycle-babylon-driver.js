// jQuery & BABYLON are externally loaded dependencies (globals)

/** @module cycle-babylon-driver */
import { Observable } from 'rx';

/**
 * Make Babylon game engine effects driver for Cycle.js
 * @param {string} mountPoint - DOM selector for canvas element
 * @param {function} createScene - scene definition
 * @return {function} - game engine effects driver
 */
export function makeGameDriver(mountPoint, createScene) {
  const canvas = jQuery(mountPoint).get(0);
  const engine = new BABYLON.Engine(canvas, true);
  const scene = createScene(engine);
  return function gameDriver() {
    function renderScene() {
      return scene.render();
    }
    engine.runRenderLoop(renderScene);
    return Observable.just({
      scene: scene
    });
  };
}
