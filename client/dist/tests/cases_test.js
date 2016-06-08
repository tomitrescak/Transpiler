"use strict";
var chai_1 = require('chai');
var Java2ts_1 = require('../Java2ts');
var YAML = require('yamljs');
var parser = require('../../../imports/parser');
var casefiles = [
    { name: 'General Test', file: 'cases.yaml', template: '', outputTemplate: '' },
    { name: 'Functions', file: 'functions.yaml', template: 'class Foo {\n$body\n}\n', outputTemplate: 'class Foo {\n  $body\n}\n' },
    { name: 'Type Checks Test', file: 'type_checks.yaml', template: 'class Foo {\n$body\n}\n', outputTemplate: 'class Foo {\n  $body\n}\n' },
];
describe('Parser', function () {
    it('parses classes', function () {
        // browse all case files
        for (var _i = 0, casefiles_1 = casefiles; _i < casefiles_1.length; _i++) {
            var file = casefiles_1[_i];
            var index = 0;
            var cases = YAML.load(require('path').join(__dirname, file.file));
            var _loop_1 = function(testCase) {
                // process template
                var input = testCase.input;
                if (file.template) {
                    input = file.template.replace('$body', input);
                }
                var testName = file.name + " > (" + index + ") " + testCase.name;
                console.log('Running ' + testName);
                index++;
                // transpile to typescript
                var builder = Java2ts_1.transpile(input);
                // check output
                if (testCase.output) {
                    var output = testCase.output;
                    if (file.outputTemplate) {
                        output = file.outputTemplate.replace('$body', output);
                    }
                    chai_1.expect(builder.text).to.equal(output, testName);
                }
                if (testCase.warnings) {
                    chai_1.expect(testCase.warnings.length, testName + ": Warnings contain\n" + builder.handler.warnings.map(function (w) { return ("[" + w.line + "] " + w.message); }).join('\n') + "\n\n").to.equal(builder.handler.warnings.length);
                    var _loop_2 = function(warning) {
                        var parts = warning.split('|');
                        var messageName = builder.Warnigns[parts[0]];
                        var messageLine = parseInt(parts[1], 10);
                        parts.splice(0, 2); // remove the first element that is message descriptor
                        var message = messageName.apply(null, parts);
                        var filtered = builder.handler.warnings.filter((function (w) { return w.line === messageLine && w.message === message; }));
                        chai_1.expect(filtered.length).be.equal(1, testName + ": Did not find [" + messageLine + "] " + message + "\nWarnings only contain:\n" + builder.handler.warnings.map(function (w) { return ("[" + w.line + "] " + w.message); }).join('\n') + "\n\n");
                    };
                    for (var _a = 0, _b = testCase.warnings; _a < _b.length; _a++) {
                        var warning = _b[_a];
                        _loop_2(warning);
                    }
                }
                if (testCase.errors) {
                    chai_1.expect(testCase.errors.length, testName + ": Errors contain\n" + builder.handler.errors.map(function (w) { return ("[" + w.line + "] " + w.message); }).join('\n') + "\n\n").to.equal(builder.handler.errors.length);
                    var _loop_3 = function(error) {
                        var parts = error.split('|');
                        var messageName = builder.Errors[parts[0]];
                        var messageLine = parseInt(parts[1], 10);
                        parts.splice(0, 2); // remove the first element that is message descriptor
                        var message = messageName.apply(null, parts);
                        var filtered = builder.handler.errors.filter((function (w) { return w.line === messageLine && w.message === message; }));
                        chai_1.expect(filtered.length).be.equal(1, testName + ":  Did not find [" + messageLine + "] " + message + "\nErrors only contain:\n" + builder.handler.errors.map(function (w) { return ("[" + w.line + "] " + w.message); }).join('\n') + "\n\n");
                    };
                    for (var _c = 0, _d = testCase.errors; _c < _d.length; _c++) {
                        var error = _d[_c];
                        _loop_3(error);
                    }
                }
                if (testCase.sourceMap) {
                    var _loop_4 = function(i) {
                        var line = builder.sourceMap.getLine(i);
                        // console.log(JSON.stringify(builder.sourceMap))
                        var filtered = line.filter(function (l) { return l.mapping.row === testCase.sourceMap[i]; });
                        chai_1.expect(filtered.length, testName + ": Source map matching failed").to.be.least(1);
                    };
                    for (var i = 0; i < testCase.sourceMap.length; i++) {
                        _loop_4(i);
                    }
                }
                console.log('=======================================================');
            };
            for (var _e = 0, cases_1 = cases; _e < cases_1.length; _e++) {
                var testCase = cases_1[_e];
                _loop_1(testCase);
            }
        }
    });
});
