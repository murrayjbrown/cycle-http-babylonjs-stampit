/** @module app */
// $ = jQuery external dependency (global)
import Rx from "rx";
import { makeDOMDriver } from "@cycle/dom";
import { makeHTTPDriver } from "@cycle/http";
import { run as runCycle } from "@cycle/core";
import { makeGameDriver } from 'cycle-babylon-driver.js';
import { createScene } from 'scene.js';
import main from "main.js";

// Enable long stack support for debugging
Rx.config.longStackSupport = true;

// Append static DOM structure
$("#app").append(
  '<div class="game">' +
    '<h1>Cycle.js Babylon game demo app</h1>' +
    '<canvas></canvas>' +
  '</div>' +
  '<div class="vdom">' +
  '</div>');

// Mount points
const appVdom = $("#app > .vdom").get(0);
const gameCanvas = $("#app > .game > canvas");

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
