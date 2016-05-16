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
  // User query form
  //
  const userQuery$ = influx.DOM.changeUserId$
    .startWith('')
    .map( (id) => {
      const user = { id: "" };
      if ( !isNaN(id) ) {
        user.id = id;
      } else {
        user.error = "Userid must be an unsigned integer value.";
      }
      return user;
    });

  //
  // HTTP query request
  //
  const URL = 'http://jsonplaceholder.typicode.com/users/';
  const httpQueryRequest$ = influx.DOM.getUserInfo$
    .withLatestFrom(userQuery$
        .where(user => !isNaN(user.id) && parseInt(user.id) > 0 ),
      (submit, user) => {
        const url = URL + user.id;
        console.log("model: query URL: %s", url);
        return url;
      });
  const httpQueryResponse$ = influx.HTTP.queryUser$
    .startWith({});

  //
  // HTTP query response
  //
  const userInfo$ = httpQueryResponse$
    .map( (resp) => {
      const u = {};
      if (_.isObject(resp)) {
        if ( _.isObject(resp.request) && 'url' in resp.request) {
          u.query = resp.request.url;
        }
        if ('error' in resp) {
          u.error = resp.error;
        }
        if ('message' in resp) {
          const info = resp.message;
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
      userQuery$: userQuery$,
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
