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
  // HTTP request/response model
  //
  const URL = 'http://jsonplaceholder.typicode.com/users/';
  const httpQueryRequest$ = influx.DOM.appSubmitGetUserInfo$
    .withLatestFrom(influx.DOM.appPropUserId$
        .where(qid => !isNaN(qid)),
      (submit, qid) => {
        let url = URL;
        url += qid ? qid : '1';
        console.log("model: query URL: %s", url);
        return url;
      });
  const httpQueryResponse$ = influx.HTTP.queryUser$
    .startWith({});

  //
  // Application model
  //

  // User information
  const appQueryUserId$ = influx.DOM.appPropUserId$
    .startWith('');
  const appUserInfo$ = Observable.combineLatest(appQueryUserId$, httpQueryResponse$,
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
    });

  // Game properties
  const appGameSphereScale$ = influx.DOM.appPropGameSphereScale$
    .startWith('1');

  //
  // Game interaction model
  //
  const gameSphereScale$ = influx.DOM.gameSubmitUpdateSphere$
    .startWith(null)
    .withLatestFrom(appGameSphereScale$
      .where(scale => !isNaN(scale) && parseFloat(scale) > 0),
    (submit, scale) => parseFloat(scale) );

  const gameBackgroundColour$ = influx.DOM.gamePropBackgroundColour$
    .startWith(null);
  const gameResize$ = influx.DOM.gameEventResize$
      .startWith(null);

  // return model states
  return {
    DOM: {
      appGameSphereScale$: appGameSphereScale$,
      appUserInfo$: appUserInfo$
    },
    GAME: {
      backgroundColour$: gameBackgroundColour$,
      sphereScale$: gameSphereScale$,
      resize$: gameResize$
    },
    HTTP: {
      user$: httpQueryRequest$
    }
  };
}
