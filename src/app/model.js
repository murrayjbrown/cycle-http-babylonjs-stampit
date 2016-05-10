/** @module model */
// _ = lodash external dependency (global)
import {Observable} from 'rx';


/**
 * Produce Cycle.js model states from events
 * @function model
 * @param {object} influx - stimulus streams
 * @return {object} states - state streams
 */
export default function model(influx) {
  //
  // Game model
  //
  const gameBackgroundColour$ = influx.DOM.colourGame$
    // .tap(() => {
    //  console.log('model colour game!');
    //  })
    .startWith(null);
  const gameResize$ = influx.DOM.resizeGame$
    .startWith(null);

  //
  // Application form model
  //
  const queryId$ = influx.DOM.changeUserId$
    .startWith('');
  const queryResponse$ = influx.HTTP.queryUser$
    .startWith({});

  // HTTP state
  const URL = 'http://jsonplaceholder.typicode.com/users/';
  const httpQueryRequest$ = influx.DOM.submitGetUserInfo$
    .withLatestFrom(influx.DOM.changeUserId$
        .where(qid => !isNaN(qid)),
      (submit, qid) => {
        let url = URL;
        url += qid ? qid : '1';
        console.log("model: query URL: %s", url);
        return url;
      });

  // Query result state
  const domUserInfo$ = Observable.combineLatest(queryId$, queryResponse$,
    (qid, resp) => {
      const u = {qid: ''};
      if ( !isNaN(qid) ) {
        u.qid = qid;
      } else {
        u.error = "ERROR: userid must be a numeric value.";
      }
      if (_.isObject(resp)) {
        if ('error' in resp) {
          u.query = URL + qid;
          u.error = resp.error;
        }
        if ('message' in resp) {
          const info = resp.message;
          u.query = URL + qid;
          if ('id' in info) {
            u.id = info.id ? info.id : "";
            u.name = info.name ? info.name : "";
            u.email = info.email ? info.email : "";
            u.site = info.website ? info.website : "";
          }
        }
      }
      return u;
    })
    .startWith({});

  // return model states
  return {
    DOM: {
      userInfo$: domUserInfo$
    },
    GAME: {
      backgroundColour$: gameBackgroundColour$,
      resize$: gameResize$
    },
    HTTP: {
      user$: httpQueryRequest$
    }
  };
}
