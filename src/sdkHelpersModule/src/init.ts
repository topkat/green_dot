/** This file is just to get the right reference to the SDK. Has this lib is meant to be installed in each SDK, the SDK must pass his $ ref so the lib can use it */


let $$

export function get$() {
  return $$
}

export function initHelpers($) {
  $$ = $
}