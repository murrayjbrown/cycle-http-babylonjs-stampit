/** @module app */

//
// This is the entry point module for the application.
// It mounts the application on the DOM tree and
// invokes its main module with effects drviers
// via the Cycle.js application runner.
//

import Rx from "rx";
import { makeDOMDriver } from "@cycle/dom";
import { makeHTTPDriver } from "@cycle/http";
import { run as runCycle } from "@cycle/core";
import { makeGameDriver } from 'cycle-babylon-driver.js';
import { createScene } from 'scene.js';
import main from "main.js";

export function app() {
  // Enable long stack support for debugging
  Rx.config.longStackSupport = true;

  // Append static DOM structure
  // Note: The game canvas MUST NOT be a virtual DOM (VDOM)
  //  element; the game engine needs it to be persistent.
  const appElement = document.getElementById("app")
  appElement.innerHTML = '<div class="game">' +
      '<h1>Cycle.js Babylon game demo app</h1>' +
      '<canvas />' +
    '</div>' +
    '<div class="vdom">' +
    '</div>';

  // Mount points for drivers
  const appVdom = $("#app > .vdom").get(0);
  const gameCanvas = $("#app > .game > canvas").get(0);

  // Cycle effects drivers
  const drivers = {
    DOM: makeDOMDriver(appVdom),
    GAME: makeGameDriver(gameCanvas, createScene),
    HTTP: makeHTTPDriver()
  };

  //
  // RUN Cycle & Game engine
  //
  runCycle(main, drivers);
}
