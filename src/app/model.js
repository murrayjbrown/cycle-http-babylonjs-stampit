/** @module model */
// _ = lodash external dependency (global)

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
  const httpQueryRequest$ = influx.DOM.getUserInfo$
    .withLatestFrom(influx.DOM.changeUserId$
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
  const userId$ = influx.DOM.changeUserId$
    .startWith('');
  const userInfo$ = influx.DOM.getUserInfo$
    .startWith(null)
    .combineLatest(userId$, httpQueryResponse$,
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

  //
  // Game interaction model
  //
  const gameBackgroundColour$ = influx.DOM.changeGameBackgroundColour$
    .startWith(null);
  const gameResize$ = influx.DOM.resizeGame$
    .startWith(null);
  const gameSphereScale$ = influx.DOM.changeGameSphereScale$
    .startWith(100)
    .map( (value) => value / 100 );

  // return model states
  return {
    DOM: {
      userInfo$: userInfo$
    },
    GAME: {
      backgroundColour$: gameBackgroundColour$,
      resize$: gameResize$,
      sphereScale$: gameSphereScale$
    },
    HTTP: {
      user$: httpQueryRequest$
    }
  };
}
