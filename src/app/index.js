/** @module app */
/* Copyright (c) 2016 Murray J Brown; All rights reserved. */
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
  const appElement = document.getElementById("app");
  appElement.innerHTML = '<div class="game">' +
      '<h2 class="gameHeader">Cycle.js Babylon game demo app</h2>' +
      '<canvas class=gameCanvas />' +
    '</div>' +
    '<div class="vdom">' +
    '</div>';

  // Mount points for drivers
  const appVdomElement = document.getElementById("app")
    .getElementsByClassName("vdom").item(0);
  const gameCanvasElement = document.getElementById("app")
    .getElementsByClassName("gameCanvas").item(0);

  // Cycle effects drivers
  const drivers = {
    DOM: makeDOMDriver(appVdomElement),
    GAME: makeGameDriver(gameCanvasElement, createScene),
    HTTP: makeHTTPDriver()
  };

  //
  // RUN Cycle & Game engine
  //
  runCycle(main, drivers);
}
