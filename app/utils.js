'use strict';

/*
A collection of utility methods, template loading, etc.
*/

define(function (require) {
    var _ = require('underscore');

    var templates = {};

    function loadTemplate (file) {
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
    }

    function loadTemplateCollection () {
        // load all templates asynchronously for app rendering
        var loadingTemplates = ['info-window'];
        var loaded = Promise.all(templates.map(loadTemplate));

        return new Promise (function (resolve, reject) {
            loaded.then(function (compiledTemplates) {
                loadingTemplates.forEach(function (name, i) {
                    templates[name] = compiledTemplates[i];
                });
                resolve();
            });
        });
    }

    return {
        templates: templates,

        init: function () {
            return new Promise (function (resolve, reject) {
                Promise.all([
                    // insert all async loading here
                    loadTemplateCollection()
                    ]).then(resolve);
            });
        },

        uniq: _.uniq, //porting underscore unique
    };
});