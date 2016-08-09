//
// This is the script loader for the application, which is
// referenced in the HTML page, and loads the application modules
// and external run-time dependencies, then invokes the application.
//
// NOTE: This main module variant is intended for production.
//  It is copied during the build process to dist/main.js.

requirejs.config({
  paths: {
    appBundle: '../dist/app/app.bundle',
    commonBundle: '../dist/app/common.bundle',
    babylon: 'https://cdnjs.cloudflare.com/ajax/libs/babylonjs/2.3.0/babylon',
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min',
    lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.11.2/lodash.min'
  }
});
requirejs(['babylon', 'jquery', 'lodash', 'commonBundle'],
  function(BABYLON, $, _, common) {
    // load application bundle
    requirejs(['appBundle'], function(bundle) {
      bundle.app();
    });
  });
