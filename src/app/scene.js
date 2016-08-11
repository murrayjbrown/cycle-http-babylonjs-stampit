/** @module scene */
//
// This module is used by the Babylon effects driver to create an initial
// scene on the canvas, which may subsequently be modified by the game
// effects module in response to DOM input effects.
//

// import BABYLON from 'babylonjs/babylon';
const BJS = BABYLON;  // external dependency

/**
 * Create a Bablyon scene
 * @function createScene
 * @param {Object} engine - game engine
 * @return {Object} scene - scene object
 */
export function createScene(engine) {
  // get rendering canvas
  const canvas = engine.getRenderingCanvas();

  // create a basic BJS Scene object
  const scene = new BJS.Scene(engine);

  // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
  const camera = new BJS.FreeCamera('camera1', new BJS.Vector3(0, 5, -10), scene);

  // target the camera to scene origin
  camera.setTarget(BJS.Vector3.Zero());

  // attach the camera to the canvas
  camera.attachControl(canvas, false);

  // create a basic light, aiming 0,1,0 - meaning, to the sky
  const light = new BJS.HemisphericLight('light1', new BJS.Vector3(0, 1, 0), scene);

  // create a built-in "sphere" shape; its constructor takes 6 params:
  //  name, segments, diameter, scene, updateable, sideOrientation
  const sphere = BJS.Mesh.CreateSphere('sphere1', 16, 2, scene, true);

  // move the sphere upward 1/2 of its height
  sphere.position.y = 1;

  // create a built-in "ground" shape; its constructor takes the same params as the sphere
  const ground = BJS.Mesh.CreateGround('ground1', 6, 6, 2, scene);

  // return the created scene
  return scene;
}
