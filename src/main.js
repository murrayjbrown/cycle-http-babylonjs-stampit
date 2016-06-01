// dependencies
const prefix = '../build/';
requirejs.config({
  paths: {
    appBundle: prefix + 'app/app.bundle',
    commonBundle: prefix + 'app/common.bundle',
    // babylon: '../vendor/babylon-2.3.0',
    babylon: 'https://cdnjs.cloudflare.com/ajax/libs/babylonjs/2.3.0/babylon',
    // jquery: '../vendor/jquery-2.2.3',
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min',
    // lodash: '../vendor/lodash-4.11.2',
    lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.11.2/lodash.min'
  }
});
// load external dependencies
requirejs(['babylon', 'jquery', 'lodash', 'commonBundle'],
  function(BABYLON, $, _, common) {
    // load application bundle
    requirejs(['appBundle'], function(bundle) {
      bundle.app();
    });
  });
