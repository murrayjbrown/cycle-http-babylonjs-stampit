/** @module intent */
//
// This module interprets DOM input effects as human intents,
// which are mapped upon actions that will be applied to the
// application state model.
//

import {Observable} from 'rx';

/**
 * Produce Cycle.js actions from DOM intents
 * @function intent
 * @param {Object} dom - DOM input effects
 * @return {Object} actions - action streams
 */
export default function intent(dom) {
  const squelchTime = 200;  // milliseconds

  //
  // Game actions
  //
  const elemGameHeader = document.getElementById("app")
    .getElementsByClassName("gameHeader").item(0);
  const clickGameBackgroundColour$ = Observable.fromEvent(elemGameHeader, 'click');
  const eventResizeGame$ = dom.events('resize')
    .throttle(squelchTime);

  //
  // Application form actions
  //

  // UserID form
  const inputUserId$ = dom.select('.input-user-id')
    .events('input')
    .debounce(squelchTime)
    .map(ev => ev.target.value);
  const clickGetUserInfo$ = dom.select('.button-get-user-info')
    .events('click');

  // return action stream(s)
  return {
    changeUserId$ : inputUserId$,
    changeGameBackgroundColour$: clickGameBackgroundColour$,
    getUserInfo$: clickGetUserInfo$,
    resizeGame$ : eventResizeGame$
  };
}
