/** @module view */
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

  function queryForm(query) {
    const queryUserid = (query && query.qid) ? query.qid : '';
    return [
      label('User: '),
      input('.input-user-id', {style: 'text', value: queryUserid }),
      button('.button-get-user-info', 'Get user info'),
      hr()
    ];
  }

  function queryResult(info) {
    return div(".result", [
      info && info.query ?
        div(".query", [
          span('.query .slug', 'Query: '),
          info.query ? span('.query .url', info.query) : '',
          hr()
        ])
        : "",
      info && info.error ?
        div(".error", [
          p(info.error)
        ])
        : "",
      info && info.id ?
        div(".details", [
          div(".user-details", [
            h2('.user-name', String(info.id) + ": " + info.name),
            h4('.user-email', info.email),
            a('.user-website', {href: info.site}, info.site)
          ])
        ])
        : ""
    ]);
  }

  // construct virtual DOM tree
  const vtree$ = Observable.combineLatest(
    components.sphereSlider$,
    states.userInfo$,
    (sphereSlider, user) => {
      return div([
        sphereSlider,
        queryForm(user),
        queryResult(user)
      ]);
    });

  // return virtual DOM tree
  return vtree$;
}
