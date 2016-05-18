/** @module model */
// _ = lodash external dependency (global)

/**
 * Produce Cycle.js model states from events
 * @function model
 * @param {object} influx - stimulus streams
 * @param {object} properties - model properties
 * @return {object} states - state streams
 */
export default function model(influx, properties) {
  //
  // Validate and set REST service property defaults
  //
  if ( !('REST' in properties) || !properties.REST ) {
    const err = "receive: [error] missing or null 'REST' model properties.";
    console.log(err);
    throw new Error(err);
  }
  if ( !('url' in properties.REST) || !properties.REST ) {
    const err = "receive: [error] missing or null 'url' REST model property.";
    console.log(err);
    throw new Error(err);
  }
  const rest = Object.assign({
    method: "GET",
    type: "application/json"
  }, properties.REST);

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
  const httpQueryRequest$ = influx.DOM.getUserInfo$
    .withLatestFrom(userQuery$
        .where(user => !isNaN(user.id) && parseInt(user.id) > 0 ),
      (submit, user) => {
        console.log("model: query URL: %s", rest.url + user.id);
        return {
          url: rest.url + user.id,
          method: rest.method,
          type: rest.type
        };
      });
  const httpQueryResponse$ = influx.HTTP.message$
    .startWith({});

  //
  // HTTP query response
  //
  const userInfo$ = httpQueryResponse$
    .map( (resp) => {
      const u = {};
      if (_.isObject(resp) && _.isObject(resp.request)) {
        u.query = 'url' in resp.request ? resp.request.url : null;
        if ('error' in resp) {
          u.error = resp.error;
        } else if ('message' in resp) {
          Object.assign(u, resp.message);
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
      send$: httpQueryRequest$
    }
  };
}
