/** @module game */
import {Observable} from 'rx';
// BABYLON = Babylon external dependency (global)

/**
 * Map Babylon game model states onto Cycle.js driver effects functions
 * @function game
 * @param {object} states - game state property streams
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
