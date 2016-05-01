// jQuery is an externally loaded dependency (global)

import {Observable} from 'rx';

//
// intent() returns a DOM action object containing action streams
//
export default function intent(dom) {
  //
  // Game actions
  //
  const elemGameHeader = jQuery("#gameHeader");
  const clickColourGame$ = Observable.fromEvent(elemGameHeader, 'click');
  const eventResizeGame$ = dom.events('resize');

  //
  // Application form actions
  //
  const debounceTime = 10;  // milliseconds
  const inputUserId$ = dom.select('.user-id')
    .events('input')
    .debounce(debounceTime)
    .map(ev => ev.target.value);
  const clickGetUserInfo$ = dom.select('.get-user-info')
    .events('click');

  // return action stream(s)
  return {
    changeUserId$ : inputUserId$,
    colourGame$: clickColourGame$,
    resizeGame$ : eventResizeGame$,
    submitGetUserInfo$: clickGetUserInfo$
  };
}
