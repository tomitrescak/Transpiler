"use strict";
var chai_1 = require('chai');
var Java2ts_1 = require('./Java2ts');
var YAML = require('yamljs');
var runLongTests = true;
if (!global['parseCache']) {
    global['parseCache'] = {};
}
var parseCache = global['parseCache'];
function runTest(file) {
    // browse all case files
    var index = 0;
    var cases = YAML.load(require('path').join(__dirname, 'tests', file.file));
    var _loop_1 = function(testCase) {
        var time = new Date().getTime();
        // some tests can take long time, we can decide whether to execute them
        if (testCase.longRunning && !runLongTests) {
            return "continue";
        }
        // process template
        var input = testCase.input;
        if (file.template) {
            input = file.template.replace('$body', input);
        }
        var testName = file.name + " > (" + index + ") " + testCase.name;
        console.log('Running: ' + testName);
        index++;
        // find parsed version of the test item
        if (!parseCache[file.name]) {
            parseCache[file.name] = {};
        }
        if (!parseCache[file.name][testCase.name]) {
            parseCache[file.name][testCase.name] = { input: input, output: Java2ts_1.parseTree(input) };
            console.log('First time ...');
        }
        var parsed = parseCache[file.name][testCase.name];
        if (parsed.input !== input) {
            parsed.source = input;
            parsed.output = Java2ts_1.parseTree(input);
        }
        // transpile to typescript
        var builder = Java2ts_1.transpileTree(parsed.output);
        // check output
        if (testCase.output) {
            var output = testCase.output;
            if (file.outputTemplate) {
                output = file.outputTemplate.replace('$body', output.trim());
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
            for (var _i = 0, _a = testCase.warnings; _i < _a.length; _i++) {
                var warning = _a[_i];
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
            for (var _b = 0, _c = testCase.errors; _b < _c.length; _b++) {
                var error = _c[_b];
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
        var duration = new Date().getTime() - time;
        console.log("Duration: " + duration + "ms");
    };
    for (var _d = 0, cases_1 = cases; _d < cases_1.length; _d++) {
        var testCase = cases_1[_d];
        _loop_1(testCase);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runTest;
