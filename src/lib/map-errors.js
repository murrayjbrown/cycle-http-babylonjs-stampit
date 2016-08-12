/** @module map-errors */
// This module implements helpers to catch mapping errors.
//
// Source: https://github.com/killercup/cycle-webpack-starter/blob/master/app/helpers/map-errors.js
// Author: Pascal Hertleif
// Derivation: Murray J Brown
// License: MIT 2016
//
import {Rx} from '@cycle/core';

//
// Helpers to catch errors
//

/**
* Return error Observable
* @function returnAsObservable
* @param {object} error - error
* @return {Observable} - error stream
*/
export function returnAsObservable(error) {
  return Rx.Observable.just({error});
}

//
// Helpers to easily map over errors
//

function isError(data) {
  return !!(data && data.error);
}

function identity(x) {
  return x;
}

/**
* Return function to check whether data is valid and,
* if so, then apply specified mapper function;
* else return data unchanged.
* @function ifOk
* @param {function} mapper - data mapper function
* @return {function} - data validation function
*/
export function ifOk(mapper) {
  return (data) => {
    return isError(data) ? data._identity : mapper(data);
  };
}

/**
* Return function to check whether data is invalid and,
* if so, then apply specified data mapper function;
* else return data unchanged.
* @function ifError
* @param {function} mapper - data mapper function
* @return {function} - data validation function
*/
export function ifError(mapper) {
  return (data) => {
    return isError(data) ? mapper(data) : identity(data);
  };
}
