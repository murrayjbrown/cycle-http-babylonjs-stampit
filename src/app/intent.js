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
  const debounceTime = 100;  // milliseconds

  //
  // Game actions
  //
  const elemGameHeader = $("#app > .game > h1").get(0);
  const clickGameBackgroundColour$ = Observable.fromEvent(elemGameHeader, 'click');
  const eventResizeGame$ = dom.events('resize')
    .debounce(debounceTime);

  //
  // Application form actions
  //

  // UserID form
  const inputUserId$ = dom.select('.input-user-id')
    .events('input')
    .debounce(debounceTime)
    .map(ev => ev.target.value)
    .distinctUntilChanged();
  const clickGetUserInfo$ = dom.select('.button-get-user-info')
    .events('click');

  // Game properties form
  // const inputGameSphereScale$ = dom.select('.input-sphere-scale')
  //   .events('input')
  //   .debounce(debounceTime)
  //   .map(ev => ev.target.value)
  //   .distinctUntilChanged()
  //   .tap((value) => {
  //     console.log("intent: inputGameSphereRadius: %s", value);
  //   });
  // const clickUpdateSphere$ = dom.select('.button-update-sphere')
  //  .events('click');

  // return action stream(s)
  return {
    changeUserId$ : inputUserId$,
    changeGameBackgroundColour$: clickGameBackgroundColour$,
    // changeGameSphereScale$ : inputGameSphereScale$,
    getUserInfo$: clickGetUserInfo$,
    resizeGame$ : eventResizeGame$
    // updateGameSphere$: clickUpdateSphere$
  };
}
