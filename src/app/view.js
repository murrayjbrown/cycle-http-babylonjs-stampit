/** @module model */
import {a, button, div, hr, h1, h4, input, label, p, span} from "@cycle/dom";

/**
 * Produce Cycle.js virtual DOM tree states from model states
 * @function view
 * @param {object} states - model state streams
 * @return {Observable} vtree$ - Virtual DOM tree stream
 */
export default function view(states) {

  // construct virtual DOM tree
  const vtree$ = states.user$
    .map((user) => div([
      label('User: '),
      input('.user-id', {style: 'text',
        value: user === null ? '' : user.id
      }),
      button('.get-user-info', 'Get user info'),
      // button('.colour-it', 'Colourize!'),
      hr(),
      p([
        span('.query-slug', 'Query: '),
        user === null ? null : span('.query-url', user.query)
      ]),
      hr(),
      user === null ? null : div('.user-details', [
        h1('.user-name', user.name),
        h4('.user-email', user.email),
        a('.user-website', {href: user.site}, user.site)
      ])
    ]));

  // return virtual DOM tree
  return vtree$;
}
