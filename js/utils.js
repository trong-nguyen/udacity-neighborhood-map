'use strict';

/*
A collection of utility methods, template loading, etc.
*/

var app = app || {};
    app.utils = app.utils || {};

(function (module, _) {

    module.loadTemplate = function (file) {
        return new Promise (function (resolve, reject) {
            $.get('templates/' + file + '.html')
                .done(function (template) {
                    // create an Underscore templating engine
                    resolve(_.template(template));
                })
                .fail(function (why) {
                    console.error('Cannot get template', file);
                    reject(why);
                })
                ;
        });
    };

    module.loadTemplateCollection = function () {
        // load all templates asynchronously for app rendering
        var templates = ['info-window'];
        var loaded = Promise.all(templates.map(module.loadTemplate));

        return new Promise (function (resolve, reject) {
            loaded.then(function (compiledTemplates) {
                module.templates = {};
                templates.forEach(function (name, i) {
                    module.templates[name] = compiledTemplates[i];
                });
                resolve();
            });
        });
    };

    module.init = function () {
        return new Promise (function (resolve, reject) {
            Promise.all([
                // insert all async loading here
                module.loadTemplateCollection()
                ]).then(resolve);
        });
    };

    module.uniq = _.uniq; //porting underscore unique
})(app.utils, _);