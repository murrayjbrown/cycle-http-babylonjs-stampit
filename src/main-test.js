//
// This is the script loader for the application, which is
// referenced in the HTML page, and loads the application modules
// and external run-time dependencies, then invokes the application.
//
// NOTE: This main module variant is intended for testing.
//  It is copied during the build process to build/main.js.

requirejs.config({
  paths: {
    appBundle: '../build/app/app.bundle',
    commonBundle: '../build/app/common.bundle'
  }
});
requirejs(['commonBundle'],
  function(common) {
    // load application bundle
    requirejs(['appBundle'], function(bundle) {
      bundle.app();
    });
  });
