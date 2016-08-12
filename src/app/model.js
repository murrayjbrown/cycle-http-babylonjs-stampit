/** @module model */
/* Copyright (c) 2016 Murray J Brown; All rights reserved. */
//
// This module implements the application data model (state).
//

/**
 * Produce Cycle.js model states from input stimuli (actions & events)
 * @function model
 * @param {Object} influx - stimulus streams
 * @param {Object} props - model properties
 * @return {Object} states - state streams
 */
export default function model(influx, props) {
  //
  // Validate and set REST service property defaults
  //
  if ( !('REST' in props) || !props.REST ) {
    const err = "receive: [error] missing or null 'REST' model properties.";
    console.log(err);
    throw new Error(err);
  }
  if ( !('url' in props.REST) || !props.REST ) {
    const err = "receive: [error] missing or null 'url' in model REST properties.";
    console.log(err);
    throw new Error(err);
  }
  const rest = Object.assign({
    method: "GET",
    type: "application/json"
  }, props.REST);

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
    .where( (resp) => resp )
    .map( (resp) => {
      const u = {};
      if ( 'request' in resp ) {
        u.query = 'url' in resp.request ?
          resp.request.url : null;
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
      gameBackgroundColour$: gameBackgroundColour$,
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
