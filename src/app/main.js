/** @module main */
import game from "game.js";
import intent from "intent.js";
import model from "model.js";
import receive from "receive.js";
import send from "send.js";
import view from "view.js";

/**
 * Main function of Cycle.js app
 * @function main
 * @param {object} sources - Cycle.js driver sources
 * @return {object} sinks - Cycle.js driver sinks
 */
export default function main(sources) {
  const actions = intent( sources.DOM );
  const messages = receive( sources.HTTP );
  const states = model( {DOM: actions, GAME: actions, HTTP: messages} );
  const request$ = send( states.HTTP );
  const vtree$ = view( states.DOM, sources.GAME );

  const game$ = game( states.GAME );

  // return sinks
  return {
    DOM: vtree$,
    GAME: game$,
    HTTP: request$
  };
}
