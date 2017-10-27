'use strict';

/*
A collection of utility methods, template loading, etc.
*/

var app = app || {};
    app.utils = app.utils || {};

(function (_) {
    app.utils.loadTemplate = function (file, success) {
        $.get('templates/' + file + '.html', success);
    };

    app.utils.compileTemplate = function (file, data, success) {
        app.utils.loadTemplate(file, function (template) {
            var compiled = _.template(template);
            success(compiled(data));
        });
    };
})(_);