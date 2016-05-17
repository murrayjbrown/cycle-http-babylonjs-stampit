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
  // Validate and set REST service access point property defaults
  //
  if ( !('REST' in properties) || !properties.REST ) {
    const err = "receive: [error] missing or null 'endpoint' property.";
    console.log(err);
    throw new Error(err);
  }
  const rest = properties.REST;
  if ( !('url' in rest) || !rest.url ) {
    const err = "receive: [error] missing or null 'url' property.";
    console.log(err);
    throw new Error(err);
  }
  if ( !('type' in rest) || !rest.type ) {
    const warn = "receive: [warning] missing or null 'type' property.";
    console.log(warn);
    rest['type'] = "application/json";
  }
  if ( !('method' in rest) || !rest.method ) {
    const warn = "receive: [warning] missing or null 'method' property.";
    console.log(warn);
    rest['method'] = "GET";
  }

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
      send$: httpQueryRequest$
    }
  };
}
