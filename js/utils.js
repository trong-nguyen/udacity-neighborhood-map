'use strict';

/*
A collection of utility methods, template loading, etc.
*/

var app = app || {};
    app.utils = app.utils || {};

(function (_) {
    app.utils.loadTemplate = function (file) {
        return new Promise (function (resolve, reject) {
            $.get('templates/' + file + '.html')
                .done(function (template) {
                    // create an Underscore templating engine
                    resolve(_.template(template))
                })
                .fail(function (why) {
                    console.error('Cannot get template', file);
                    reject(why);
                })
                ;
        });
    };

    app.utils.loadTemplateCollection = function () {
        // load all templates asynchronously for app rendering
        var templates = ['info-window'];
        var loaded = Promise.all(templates.map(app.utils.loadTemplate));

        return new Promise (function (resolve, reject) {
            loaded.then(function (compiledTemplates) {
                app.utils.templates = {};
                templates.forEach(function (name, i) {
                    app.utils.templates[name] = compiledTemplates[i];
                });
                resolve();
            });
        });
    };

    app.utils.init = function () {
        return new Promise (function (resolve, reject) {
            Promise.all([
                // insert all async loading here
                app.utils.loadTemplateCollection()
                ]).then(resolve);
        });
    };
})(_);