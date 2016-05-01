import {a, button, div, hr, h1, h4, input, label, p, span} from "@cycle/dom";

//
// view() returns stream of virtual dom tree (vtree$) effects
//
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
