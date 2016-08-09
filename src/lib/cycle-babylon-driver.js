/** @module cycle-babylon-driver */
// BABYLON = Babylon external dependency (global)
import { Observable } from 'rx';

/**
 * Make Babylon game engine effects driver for Cycle.js
 * @param {string} canvas - canvas element
 * @param {function} createScene - scene definition
 * @return {function} - game engine effects driver
 */
export function makeGameDriver(canvas, createScene) {
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
