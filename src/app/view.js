/** @module view */
// _ = lodash external dependency (global)

import {Observable} from 'rx';
import {a, button, div, hr, h2, h4, input, label, p, span} from "@cycle/dom";

/**
 * Produce Cycle.js virtual DOM tree states from model states
 * @function view
 * @param {object} states - model state streams
 * @param {object} components - component Virtual DOM tree streams
 * @return {Observable} vtree$ - application Virtual DOM tree stream
 */
export default function view(states, components) {

  function formError(msg) {
    let errorMsg = "";
    if (msg) {
      errorMsg = [ p('.error', msg) ];
    }
    return errorMsg;
  }

  function queryForm(user) {
    return [ label('User: '),
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
    if ( _.isObject(info) ) {
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
    states.userQuery$,
    states.userInfo$,
    (sphereSlider, userQuery, userInfo) => {
      return div([
        sphereSlider,
        queryForm(userQuery),
        queryResult(userInfo)
      ]);
    });

  // return virtual DOM tree
  return vtree$;
}
