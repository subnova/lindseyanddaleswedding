require.config({
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
    js: ".",
    app: "app",
    aws: "../bower_components/aws-sdk/dist/aws-sdk",
    "bootstrap-sass": "../bower_components/bootstrap-sass/assets/javascripts/bootstrap",
    "google-maps": "../bower_components/google-maps/lib/Google",
    jquery: "../bower_components/jquery/dist/jquery",
    knockout: "../bower_components/knockout/dist/knockout",
    html5shiv: "../bower_components/html5shiv/dist/html5shiv",
    requirejs: "../bower_components/requirejs/require",
    respond: "../bower_components/respond/dest/respond.src",
    "jquery.easing": "../bower_components/jquery-easing/jquery.easing.min",
    font: "../bower_components/requirejs-plugins/src/font",
    propertyParser: "../bower_components/requirejs-plugins/src/propertyParser",
    lodash: "../bower_components/lodash/lodash",
    markdown: "../bower_components/markdown/lib/markdown",
    async: "../bower_components/requirejs-plugins/src/async",
    goog: "../bower_components/requirejs-plugins/src/goog",
    image: "../bower_components/requirejs-plugins/src/image",
    text: "../bower_components/requirejs-plugins/lib/text",
    "bower-webfontloader": "../bower_components/bower-webfontloader/webfont",
    "Markdown.Converter": "../bower_components/requirejs-plugins/lib/Markdown.Converter",
    json: "../bower_components/requirejs-plugins/src/json",
    depend: "../bower_components/requirejs-plugins/src/depend",
    mdown: "../bower_components/requirejs-plugins/src/mdown",
    noext: "../bower_components/requirejs-plugins/src/noext"
  },
  packages: [

  ]
});

// configure loading of fonts
requirejs(['./site'], function(site) {
  requirejs(['font!typekit,id:' + site.apikey.typekit], function() {});
});
