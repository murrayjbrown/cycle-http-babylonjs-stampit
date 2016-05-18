/** @module rest-messaging */
// _ = lodash external dependency (global)
import {Observable} from 'rx';

/**
 * Receive REST service responses filtered by request properties
 * @function receive
 * @param {object} HTTPsource - HTTP driver sources
 * @param {object} props - REST request properties
 * @return {object} messages - message stream(s)
 */
export function receive(HTTPsource, props) {
  const NOTAVAIL = "Not available";
  if ( !('url' in props) || !props.url ) {
    const err = "missing or invalid 'url' property.";
    console.log(err);
    throw new Error(err);
  }
  const req = Object.assign({
    method: "GET",
    type: "application/json"
  }, props);

  //
  // Filter & flatten response message stream(s).
  //
  // We catch any http error objects and pass them through;
  // this allows for retries after an error occurs.
  const message$ = HTTPsource
    .filter(resp$ => resp$.request.url.indexOf(req.url) >= 0)
    .flatMap(resp => resp.catch(Observable.just({
      url: ('request' in resp && 'url' in resp.request) ?
        resp.request.url : "",
      err: NOTAVAIL
    })))
    .map((resp) => {
      let result = {};
      if ( 'err' in resp && resp.err === NOTAVAIL ) {
        console.log("receive: [error] %s.", resp.err);
        result = { error: resp.err };
      } else {
        result['request'] = resp.request;
        if ('body' in resp) {
          if ('type' in resp) {
            if (resp.type === req.type) {
              result['message'] = resp.body;
            } else {
              result['error'] = "Unexpected content-type - '" + resp.type + "'.";
              console.log("receive: [error] %s", result['error']);
            }
          }
        }
      }
      return result;
    });

  // return message stream
  return {
    message$: message$
  };
}


/**
 * Send REST service requests mapped from HTTP model states
 * @function send
 * @param {object} HTTPstates - HTTP request state streams
 * @return {Observable} request$ - HTTP request stream
 */
export function send(HTTPstates) {
  //
  // Map HTTP state stream onto HTTP request stream
  //
  const request$ = HTTPstates.send$
  .where( (props) => props && _.isObject(props) )
  .map( (props) => {
    if ( !('url' in props) || !props.url ) {
      const err = "missing or invalid 'url' property.";
      console.log(err);
      throw new Error(err);
    }
    return Object.assign({
      method: "GET",
      type: "application/json",
      accept: "application/json"
    }, props);
  });

  // return HTTP request stream
  return request$;
}
