/** @module cycle-babylon-driver */
import { Observable } from 'rx';
// $ = jQuery external dependency (global)
// BABYLON = Babylon external dependency (global)

/**
 * Make Babylon game engine effects driver for Cycle.js
 * @param {string} mountPoint - DOM selector for canvas element
 * @param {function} createScene - scene definition
 * @return {function} - game engine effects driver
 */
export function makeGameDriver(mountPoint, createScene) {
  const canvas = $(mountPoint).get(0);
  const engine = new BABYLON.Engine(canvas, true);
  const scene = createScene(engine);
  /**
   * Babylon game engine effects driver for Cycle.js
   * @param {Observable} effects$ - effects function stream
   * @return {Observable} scene$ - game scene stream
   */
  return function gameDriver(effects$) {
    // invoke game effect functions
    effects$.subscribeOnNext((effect) => {
      effect(scene);
    });
    // handle errors
    effects$.subscribeOnError((err) => {
      console.log("gameDriver: %s", err);
    });
    // handle completion
    effects$.subscribeOnCompleted(() => {
      console.log("gameDriver: completed.");
    });
    // render scene
    engine.runRenderLoop(() => {
      scene.render();
    });
    // return scene$ stream
    return Observable.just(scene);
  };
}
