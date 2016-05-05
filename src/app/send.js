/** @module send */

/**
 * Send Cycle.js HTTP requests
 * @function receive
 * @param {object} HTTPstates - HTTP request state streams
 * @return {Observable} request$ - HTTP request stream
 */
export default function send(HTTPstates) {
  const request$ = HTTPstates.user$.map( (url) => {
    return {
      url: url,
      method: 'GET'
    };
  });

  // return HTTP request stream
  return request$;
}
