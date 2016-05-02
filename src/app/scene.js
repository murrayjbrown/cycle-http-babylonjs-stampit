// BABYLON is an externally loaded dependency (global)

/** @module createScene */

/**
 * Create a Bablyon scene
 * @function createScene
 * @param {object} engine - game engine
 * @return {object} scene - scene object
 */
export function createScene(engine) {
  // get rendering canvas
  const canvas = engine.getRenderingCanvas();

  // create a basic BJS Scene object
  const scene = new BABYLON.Scene(engine);

  // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);

  // target the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // attach the camera to the canvas
  camera.attachControl(canvas, false);

  // create a basic light, aiming 0,1,0 - meaning, to the sky
  const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

  // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
  const sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

  // move the sphere upward 1/2 of its height
  sphere.position.y = 1;

  // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
  // const ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

  // return the created scene
  return scene;
}
