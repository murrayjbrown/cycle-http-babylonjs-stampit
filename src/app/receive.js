/** @module receive */
// _ = lodash external dependency (global)
import {Observable} from 'rx';


/**
 * Receive Cycle.js HTTP responses
 * @function receive
 * @param {object} HTTPsource - HTTP driver sources
 * @return {object} messages - message streams
 */
export default function receive(HTTPsource) {
  const NOTAVAIL = "Not available";
  const SITE = 'jsonplaceholder.typicode.com';
  // Filter & flatten response message stream(s).
  //  The response stream is a stream of streams,
  //  i.e. each response will be its own stream
  //  so usually you want to catch errors for that
  //  single response stream:

  // const response$$ = HTTPsource
  // /   .filter(response$ => response$.request.url.indexOf(SITE) >= 0);

  // We catch any http error objects and pass them through
  // This allows for retries after an error occurs
  const queryUserResponse$ = HTTPsource
    .filter(resp$ => resp$.request.url.indexOf(SITE) >= 0)
    // .flatMap(resp => resp.catch(err => Observable.just({err}))
    // .flatMap()
    .map(resp => resp.catch(Observable.just(NOTAVAIL)))
    .mergeAll()
    .map((resp) => {
      let result = {};
      if ( resp === NOTAVAIL ) {
        console.log("receive: " + NOTAVAIL);
        result = { error: NOTAVAIL };
      } else if ( _.isObject(resp) ) {
        result['request'] = resp.request;
        if ('body' in resp) {
          if ('type' in resp) {
            if (resp.type === "application/json") {
              console.log("receive: JSON message");
              result['message'] = resp.body;
            } else {
              result['error'] = "Unexpected content-type - " + resp.type;
            }
          }
        }
      }
      return result;
    });

  // return message streams
  return {
    queryUser$: queryUserResponse$
  };
}
