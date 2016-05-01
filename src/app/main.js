//
// MAIN
//
import game from "./game.js";
import intent from "./intent.js";
import model from "./model.js";
import receive from "./receive.js";
import send from "./send.js";
import view from "./view.js";

export default function main(sources) {
  const actions = intent( sources.DOM );
  const messages = receive( sources.HTTP );
  const states = model( {DOM: actions, GAME: actions, HTTP: messages} );
  const request$ = send( states.HTTP );
  const vtree$ = view( states.DOM, sources.GAME );

  const game$ = game( sources.GAME, states.GAME );

  // return sinks
  return {
    DOM: vtree$,
    GAME: game$,
    HTTP: request$
  };
}
