/** @module intent */
// $ = jQuery external dependency (global)
import {Observable} from 'rx';


/**
 * Produce Cycle.js actions from DOM intents
 * @function intent
 * @param {object} dom - DOM input effects
 * @return {object} actions - action streams
 */
export default function intent(dom) {
  //
  // Game actions
  //
  const elemGameHeader = $("#app > .game > h1").get(0);
  const clickGameBackgroundColour$ = Observable.fromEvent(elemGameHeader, 'click');
  const eventResizeGame$ = dom.events('resize');

  //
  // Application form actions
  //
  const debounceTime = 100;  // milliseconds

  // UserID form
  const inputUserId$ = dom.select('.input-user-id')
    .events('input')
    .debounce(debounceTime)
    .map(ev => ev.target.value)
    .distinctUntilChanged()
    .tap((value) => {
      console.log("intent: inputUserID: %s", value);
    });
  const clickGetUserInfo$ = dom.select('.button-get-user-info')
    .events('click');

  // Game properties form
  const inputGameSphereScale$ = dom.select('.input-sphere-scale')
    .events('input')
    .debounce(debounceTime)
    .map(ev => ev.target.value)
    .distinctUntilChanged()
    .tap((value) => {
      console.log("intent: inputGameSphereRadius: %s", value);
    });
  const clickUpdateSphere$ = dom.select('.button-update-sphere')
    .events('click');

  // return action stream(s)
  return {
    appPropUserId$ : inputUserId$,
    appPropGameSphereScale$ : inputGameSphereScale$,
    appSubmitGetUserInfo$: clickGetUserInfo$,
    gamePropBackgroundColour$: clickGameBackgroundColour$,
    gameEventResize$ : eventResizeGame$,
    gameSubmitUpdateSphere$: clickUpdateSphere$
  };
}
