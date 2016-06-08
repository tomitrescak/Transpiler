"use strict";
var chai_1 = require('chai');
var Java2ts_1 = require('../Java2ts');
var YAML = require('yamljs');
var parser = require('../../../imports/parser');
var cases = YAML.load(require('path').join(__dirname, 'cases.yaml'));
//sadasdad
describe('Parser', function () {
    it('parses classes', function () {
        var index = 0;
        var _loop_1 = function(testCase) {
            index++;
            var builder = Java2ts_1.transpile(testCase.input);
            if (testCase.output) {
                chai_1.expect(builder.text).to.equal(testCase.output, "Test (" + index + ") - " + testCase.name);
            }
            if (testCase.warnings) {
                chai_1.expect(testCase.warnings.length, "Test (" + index + ") - " + testCase.name + " - Warnings contain:\n" + builder.handler.warnings.map(function (w) { return ("[" + w.line + "] " + w.message); }).join('\n') + "\n\n").to.equal(builder.handler.warnings.length);
                var _loop_2 = function(warning) {
                    var parts = warning.split('|');
                    var messageName = builder.Warnigns[parts[0]];
                    var messageLine = parseInt(parts[1], 10);
                    parts.splice(0, 2); // remove the first element that is message descriptor
                    var message = messageName.apply(null, parts);
                    var filtered = builder.handler.warnings.filter((function (w) { return w.line === messageLine && w.message === message; }));
                    chai_1.expect(filtered.length).be.equal(1, "Test (" + index + ") - " + testCase.name + ": Did not find [" + messageLine + "] " + message + "\nWarnings only contain:\n" + builder.handler.warnings.map(function (w) { return ("[" + w.line + "] " + w.message); }).join('\n') + "\n\n");
                };
                for (var _i = 0, _a = testCase.warnings; _i < _a.length; _i++) {
                    var warning = _a[_i];
                    _loop_2(warning);
                }
            }
            if (testCase.errors) {
                chai_1.expect(testCase.errors.length, "Test (" + index + ") - " + testCase.name + " - Errors contain:\n" + builder.handler.errors.map(function (w) { return ("[" + w.line + "] " + w.message); }).join('\n') + "\n\n").to.equal(builder.handler.errors.length);
                var _loop_3 = function(error) {
                    var parts = error.split('|');
                    var messageName = builder.Errors[parts[0]];
                    var messageLine = parseInt(parts[1], 10);
                    parts.splice(0, 2); // remove the first element that is message descriptor
                    var message = messageName.apply(null, parts);
                    var filtered = builder.handler.errors.filter((function (w) { return w.line === messageLine && w.message === message; }));
                    chai_1.expect(filtered.length).be.equal(1, "Test (" + index + ") - " + testCase.name + ": Did not find [" + messageLine + "] " + message + "\nErrors only contain:\n" + builder.handler.errors.map(function (w) { return ("[" + w.line + "] " + w.message); }).join('\n') + "\n\n");
                };
                for (var _b = 0, _c = testCase.errors; _b < _c.length; _b++) {
                    var error = _c[_b];
                    _loop_3(error);
                }
            }
            if (testCase.sourceMap) {
                var _loop_4 = function(i) {
                    var line = builder.sourceMap.getLine(i);
                    console.log(JSON.stringify(builder.sourceMap));
                    var filtered = line.filter(function (l) { return l.mapping.row === testCase.sourceMap[i]; });
                    chai_1.expect(filtered.length, "Test (" + index + ") - " + testCase.name + ": Source map matching failed").to.be.least(1);
                };
                for (var i = 0; i < testCase.sourceMap.length; i++) {
                    _loop_4(i);
                }
            }
            console.log('=======================================================');
        };
        for (var _d = 0, cases_1 = cases; _d < cases_1.length; _d++) {
            var testCase = cases_1[_d];
            _loop_1(testCase);
        }
    });
});
