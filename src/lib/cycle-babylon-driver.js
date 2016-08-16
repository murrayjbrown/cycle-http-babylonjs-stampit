/** @module cycle-babylon-driver */
/* Copyright (c) 2016 Murray J Brown; All rights reserved. */
//
// This module implements the Babylon effects driver to create an initial
// scene on the canvas, which may subsequently be modified by the game
// effects module in response to DOM input effects.
//
import { Observable } from 'rx';

/**
 * Make Babylon game engine effects driver for Cycle.js
 * @param {string} sceneDriver - Babylon Scene driver
 * @return {function} - game engine effects driver
 */
export function makeGameDriver(sceneDriver) {

  const scene = sceneDriver.setup();
  const engine = sceneDriver.getEngine();

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
