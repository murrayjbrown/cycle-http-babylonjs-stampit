/**
** Source: http://cycle.js.org/components.html
** Author: André Staltz
** Derivation: Murray J Brown
** License: MIT 2016
**/

/** @module view */
import {Observable} from "rx";
import {div, span, input} from "@cycle/dom";

/**
 * Labeled Slider Cycle.js component
 * @function LabeledSlider
 * @param {object} sources - source streams
 * @return {Observable} vtree$ - Virtual DOM tree stream
 */
export function LabeledSlider(sources) {
  const initialValue$ = sources.props$
    .map(props => props.initial)
    .first();

  const newValue$ = sources.DOM
    .select('.slider')
    .events('input')
    .map(ev => ev.target.value);

  const value$ = initialValue$.concat(newValue$);

  const vtree$ = Observable.combineLatest(sources.props$, value$,
    (props, value) =>
      div('.labeled-slider', [
        span('.label',
          props.label + ' ' + value + props.unit
        ),
        input('.slider', {
          type: 'range', min: props.min, max: props.max, value
        })
      ])
  );

  const sinks = {
    DOM: vtree$,
    value$
  };
  return sinks;
}
