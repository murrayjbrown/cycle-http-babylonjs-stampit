// Bundled dependencies
import { createScene } from 'scene.js';
import { makeDOMDriver } from "@cycle/dom";
import { makeHTTPDriver } from "@cycle/http";
import { run as runCycle } from "@cycle/core";
import { makeGameDriver } from 'cycle-babylon-driver.js';

// Application components
import main from "./main";

// Cycle effects drivers
const drivers = {
  DOM: makeDOMDriver('#app'),
  GAME: makeGameDriver('#game', createScene),
  HTTP: makeHTTPDriver()
};

//
// RUN Cycle & Game engine
//
runCycle(main, drivers);
