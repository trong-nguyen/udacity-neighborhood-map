'use strict';

/*
A collection of utility methods, template loading, etc.
*/

// TODOS:
// MOVE TEMPLATES OUT OF SERVICE INIT, ITS NOT INIT, ITS A MEMBER METHOD, NOT MODULE, MODULE SHOULD BY ALL THE WAY SYNCHRONOUS
// SIMILARLY MOVE FETCHDATA OUT OF MODEL INIT, SUCH AS LOAD_PREDEFINED DATA

define(function (require) {
    var _ = require('underscore');

    var templates = {};
    var templateNames = ['info-window'];

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
                });
        });
    }

    function loadTemplateCollection () {
        // load all templates asynchronously for app rendering
        var loaded = Promise.all(templateNames.map(loadTemplate));

        return new Promise (function (resolve, reject) {
            loaded.then(function (compiledTemplates) {
                templateNames.forEach(function (name, i) {
                    templates[name] = compiledTemplates[i];
                });
                resolve(templates);
            })
            .catch(reject);
        });
    }

    return {
        templates: templates,

        init: loadTemplateCollection,
    };
});