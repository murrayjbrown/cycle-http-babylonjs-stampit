/** @module main */
import {Observable} from 'rx';
import isolate from "@cycle/isolate";

// application component parts
import game from "game.js";
import intent from "intent.js";
import model from "model.js";
import view from "view.js";

// reusable dataflow component(s)
import {LabeledSlider} from "labeled-slider.js";
import {receive, send} from "rest-messaging.js";

/**
 * Main function of Cycle.js app
 * @function main
 * @param {Object} sources - Cycle.js driver sources
 * @return {Object} sinks - Cycle.js driver sinks
 */
export default function main(sources) {
  //
  // Determine actions from human intent
  //
  const actions = intent( sources.DOM );

  //
  // Receive HTTP response messages
  //
  const restProps = {   // REST service properties
    url: "http://jsonplaceholder.typicode.com/users/",
    method: "GET",
    type: "application/json"
  };
  const messages = receive( sources.HTTP, restProps );

  //
  // Embed reusable dataflow component(s)
  //
  const components = {};
  // LabeledSlider component used to scale sphere size for game
  const sphereProps$ = Observable.of({
    label: 'Sphere scale: ', unit: '%', min: 0, initial: 100, max: 300
  });
  const sphereSources = {DOM: sources.DOM, props$: sphereProps$};
  const sphereSlider = isolate(LabeledSlider)(sphereSources);
  components['sphereSlider$'] = sphereSlider.DOM;
  actions['changeGameSphereScale$'] = sphereSlider.value$;

  //
  // Determine model state(s)
  //
  const states = model( {DOM: actions, HTTP: messages}, {REST: restProps} );

  //
  // Send HTTP request messages
  //
  const request$ = send( states.HTTP );

  //
  // Produce game effects
  //
  const game$ = game( states.GAME );

  //
  // Produce Virtual DOM effects
  //
  const vtree$ = view( states.DOM, components );

  // return sinks
  return {
    DOM: vtree$,
    GAME: game$,
    HTTP: request$
  };
}
