var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  shim: {
    "bootstrap-sass": {
      deps: [
        "jquery"
      ]
    },
    "jquery.easing": {
      deps: [
        "jquery"
      ]
    },
    markdown: {
      exports: "markdown"
    }
  },

  paths: {
    'html': "/base/_includes",
    'js': "/base/_site/js",
    'app': "/base/_site/js/app",
    "aws": "/base/_site/bower_components/aws-sdk/dist/aws-sdk",
    "bootstrap-sass": "/base/_site/bower_components/bootstrap-sass/assets/javascripts/bootstrap",
    "google-maps": "/base/_site/bower_components/google-maps/lib/Google",
    jquery: "/base/_site/bower_components/jquery/dist/jquery",
    knockout: "/base/_site/bower_components/knockout/dist/knockout",
    "jquery.easing": "/base/_site/bower_components/jquery-easing/jquery.easing.min",
    propertyParser: "/base/_site/bower_components/requirejs-plugins/src/propertyParser",
    text: "/base/_site/bower_components/requirejs-plugins/lib/text",
    lodash: "/base/_site/bower_components/lodash/lodash",
    markdown: "/base/_site/bower_components/markdown/lib/markdown"
  },

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
