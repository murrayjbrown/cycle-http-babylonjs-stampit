/** @module view */
/* Copyright (c) 2016 Murray J Brown; All rights reserved. */
//
// This module processes changes to the application state(s)
// (as a result of DOM input effects, i.e., human intents, or
// HTTP response messages received) and renders corresponding
// virtual DOM elements to be processed by the DOM driver.
//

import {Observable} from 'rx';
import {a, button, div, hr, h2, h4, input, label, p, span} from "@cycle/dom";

/**
 * Produce Cycle.js virtual DOM tree states from model states
 * @function view
 * @param {Object} states - model state streams
 * @param {Object} components - component Virtual DOM tree streams
 * @return {Observable} vtree$ - application Virtual DOM tree stream
 */
export default function view(states, components) {

  function bgColourButton(bgColour) {
    return [ button('.colour-game-background', 'Generate random background colour') ];
  }

  function formError(msg) {
    let errorMsg = "";
    if (msg) {
      errorMsg = [ p('.error', msg) ];
    }
    return errorMsg;
  }

  function queryForm(user) {
    return [ hr(),
      h4('Query user information from test server'),
      label('Number: '),
      input('.input-user-id', {style: 'text'}),
      button('.button-get-user-info', 'Get user info'),
      formError(user.error),
      hr()
    ];
  }

  function queryResult(info) {
    let result = "";
    let infoQuery = "";
    let infoError = "";
    let userDetails = "";
    if ( typeof info === 'object' ) {
      if ( 'query' in info ) {
        infoQuery = div(".query", [
          span('.query .slug', 'Query: '),
          info.query ? span('.query .url', info.query) : '',
          hr()
        ]);
      }
      if( 'error' in info ) {
        infoError = formError(info.error);
      }
      if ( 'id' in info ) {
        userDetails = div(".details", [
          div(".user-details", [
            h2('.user-name', String(info.id) + ": " + info.name),
            h4('.user-email', info.email),
            a('.user-website', {href: info.website}, info.website)
          ])
        ]);
      }
      result = div(".result", [
        infoQuery,
        infoError,
        userDetails
      ]);
    }
    return result;
  }

  // construct virtual DOM tree
  const vtree$ = Observable.combineLatest(
    components.sphereSlider$,
    states.gameBackgroundColour$,
    states.userQuery$,
    states.userInfo$,
    (sphereSlider, gameBackgroundColour, userQuery, userInfo) => {
      return div([
        bgColourButton(gameBackgroundColour),
        sphereSlider,
        queryForm(userQuery),
        queryResult(userInfo)
      ]);
    });

  // return virtual DOM tree
  return vtree$;
}
