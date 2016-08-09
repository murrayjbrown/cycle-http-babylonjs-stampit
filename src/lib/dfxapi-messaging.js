/** @module dfxapi-messaging */
// _ = lodash external dependency (global)
import {Observable} from 'rx';

/**
 * Receive RESTful Datifex API service responses filtered by request properties
 * @function receive
 * @param {Object} HTTPsource - HTTP driver source
 * @param {Object} props - API request properties
 * @return {Object} messages - message stream(s)
 */
export function receive(HTTPsource, props) {
  const NOTAVAIL = "Not available";

  //
  // validate and/or set filter property defaults
  //
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
    .filter(resp$ => resp$.request.url.indexOf(props.url) >= 0)
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
 * Send RESTful Datifex API service requests mapped from HTTP model states
 * @function send
 * @param {Object} HTTPstates - HTTP request state streams
 * @return {Observable} request$ - HTTP request stream
 */
export function send(HTTPstates) {
  //
  // Map HTTP state stream onto HTTP request stream
  //
  const request$ = HTTPstates.send$
  .where( (props) => props && typeof props === 'object' )
  .map( (props) => {
    if ( !('url' in props) || !props.url ) {
      const err = "missing or invalid 'url' property.";
      console.log(err);
      throw new Error(err);
    }
    const req = Object.assign({
      method: "POST",
      type: "application/json",
      accept: "application/json"
    }, props);
    req.method = "POST";  // ignore any override
    if ( !('headers' in props) || !props.headers ) {
      req.headers = Object.assign({
        'X-Http-Method-Override': 'method' in props ? props.method : "GET"
      }, props.headers);
    }
    return req;
  });

  // return HTTP request stream
  return request$;
}
