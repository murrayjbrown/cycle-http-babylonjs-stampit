/** @module game */
//
// This module processes changes to the application state(s)
// (as a result of DOM input effects, i.e., human intents, or
// HTTP response messages received) and renders corresponding
// effects functions to be processed by the Babylon game driver.
//
import {Observable} from 'rx';

// import BABYLON from 'babylonjs/babylon';
const BJS = BABYLON;  // external dependency

/**
 * Map Babylon game model states onto Cycle.js driver effects functions
 * @function game
 * @param {Object} states - game state property streams
 * @return {Observable} - game effects functions stream
 */
export default function game(states) {
  //
  // The returned effects$ stream must be comprised of functions
  // for producing each of the various game effects. The various
  // effect streams are merged together and emitted as a single
  // stream. Each effect function shall be called by the game
  // driver with its scene parameter:
  //    effect(scene)
  // The game engine for the scene may be derived via:
  //    scene.getEngine()
  //

  // change background colour function
  const backgroundColour$ = states.backgroundColour$
    .distinctUntilChanged()
    .map(() => {
      return function effect(scene) {
        const red = Math.random();
        const green = Math.random();
        const blue = Math.random();
        scene.clearColor = new BABYLON.Color4(red, green, blue);
      };
    });

  // resize game function
  const resize$ = states.resize$
    .distinctUntilChanged()
    .map(() => {
      return function effect(scene) {
        const engine = scene.getEngine();
        engine.resize();
      };
    });

  // set sphere radius
  const sphereScale$ = states.sphereScale$
    .distinctUntilChanged()
    .map((scale) => {
      return function effect(scene) {
        const sphere = scene.getMeshByName('sphere1');
        sphere.scaling.x = scale;
        sphere.scaling.y = scale;
        sphere.scaling.z = scale;
      };
    });

  // return effects$ stream
  return Observable.merge(
    backgroundColour$,
    resize$,
    sphereScale$
  );
}
