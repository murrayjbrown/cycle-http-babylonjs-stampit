/** @module model */
import {Observable} from 'rx';

/**
 * Produce Cycle.js model states from events
 * @function model
 * @param {object} events - event streams
 * @return {object} states - state streams
 */
export default function model(events) {
  //
  // Game model
  //
  const colourGame$ = events.DOM.colourGame$
    // .tap(() => {
    //  console.log('model colour game!');
    //  })
    .startWith(null);
  const resizeGame$ = events.DOM.resizeGame$
    .startWith(null);

  //
  // Application model
  //
  const ENDPOINT = 'http://jsonplaceholder.typicode.com/users/';
  const endpoint$ = events.DOM.submitGetUserInfo$
    .withLatestFrom(events.DOM.changeUserId$,
      (submit, userid) => {
        return userid ? ENDPOINT + userid : ENDPOINT + '';
      });

  const userId$ = events.DOM.changeUserId$
    .map( (userid) => userid)
    .startWith('');

  const userInfo$ = events.HTTP.user$
    .startWith({});

  const user$ = Observable.combineLatest(userId$, userInfo$,
    (id, info) => {
      const u = {id: ''};
      if (id) {
        u.id = id;
        if (info) {
          u.query = ENDPOINT + id;
          u.name = info.name;
          u.email = info.email;
          u.site = info.website;
        }
      }
      return u;
    });

  // return model states
  return {
    DOM: {
      user$: user$
    },
    GAME: {
      colour$: colourGame$,
      resize$: resizeGame$
    },
    HTTP: {
      user$: endpoint$
    }
  };
}
