'use strict';

/*
A collection of utility methods, template loading, etc.
*/

define(function (require) {
    var
        _         = require('underscore'),
        templates = require('templates');

    // convert html templates to underscore compiled templates
    var compiledTemplates = {};

    Object.keys(templates).forEach(function (name) {
        compiledTemplates[name] = _.template(templates[name]);
    });

    return {
        templates: compiledTemplates
    };
});