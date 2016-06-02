"use strict";
var chai_1 = require('chai');
var CompilationUnitVisitor_1 = require('../visitors/CompilationUnitVisitor');
var Visitor_1 = require('../visitors/Visitor');
var YAML = require('yamljs');
var parser = require('../../../imports/parser');
var cases = YAML.load(require('path').join(__dirname, 'cases.yaml'));
describe('Parser', function () {
    it('parses classes', function () {
        var index = 0;
        for (var _i = 0, cases_1 = cases; _i < cases_1.length; _i++) {
            var testCase = cases_1[_i];
            var parsed = parser.parse(testCase.input);
            var cuVisitor = new CompilationUnitVisitor_1.default(null);
            var result = cuVisitor.visit(parsed);
            chai_1.expect(result).to.equal(testCase.output, "Test (" + index++ + ") - " + testCase.name + "\n");
            if (testCase.warnings) {
                chai_1.expect(testCase.warnings.length).to.equal(Visitor_1.default.handler.warnings.length);
                var _loop_1 = function(warning) {
                    var parts = warning.split('|');
                    var messageName = Visitor_1.default.Warnigns[parts[0]];
                    var messageLine = parseInt(parts[1], 10);
                    parts.splice(0, 2); // remove the first element that is message descriptor
                    var message = messageName.apply(null, parts);
                    var filtered = Visitor_1.default.handler.warnings.filter((function (w) { return w.line === messageLine && w.message === message; }));
                    chai_1.expect(filtered.length).be.equal(1, "Test (" + index++ + ") - " + testCase.name + ": Did not find [" + messageLine + "] " + message + "\nWarnings only contain:\n" + Visitor_1.default.handler.warnings.map(function (w) { return ("[" + w.line + "] " + w.message); }).join('\n') + "\n\n");
                };
                for (var _a = 0, _b = testCase.warnings; _a < _b.length; _a++) {
                    var warning = _b[_a];
                    _loop_1(warning);
                }
            }
            if (testCase.errors) {
                chai_1.expect(testCase.errors.length).to.equal(Visitor_1.default.handler.errors.length);
                var _loop_2 = function(error) {
                    var parts = error.split('|');
                    var messageName = Visitor_1.default.Errors[parts[0]];
                    var messageLine = parseInt(parts[1], 10);
                    parts.splice(0, 2); // remove the first element that is message descriptor
                    var message = messageName.apply(null, parts);
                    var filtered = Visitor_1.default.handler.errors.filter((function (w) { return w.line === messageLine && w.message === message; }));
                    chai_1.expect(filtered.length).be.equal(1, "Test (" + index++ + ") - " + testCase.name + ": Did not find [" + messageLine + "] " + message + "\nErrors only contain:\n" + Visitor_1.default.handler.errors.map(function (w) { return ("[" + w.line + "] " + w.message); }).join('\n') + "\n\n");
                };
                for (var _c = 0, _d = testCase.errors; _c < _d.length; _c++) {
                    var error = _d[_c];
                    _loop_2(error);
                }
            }
            if (testCase.sourceMap) {
                for (var i = 0; i < testCase.sourceMap.length; i++) {
                    console.log(Visitor_1.default.sourceMap);
                    chai_1.expect(Visitor_1.default.sourceMap.getLine(i), "Source map matching failed").to.equal(testCase.sourceMap[i]);
                }
            }
        }
    });
});
