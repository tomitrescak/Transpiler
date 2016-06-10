"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses function parameters', function () {
        cases_test_1.default({
            name: 'Function Parameters Test',
            file: 'cases/function_parameters.yaml',
            template: 'class Foo {\n$body\n}\n',
            outputTemplate: 'class Foo {\n  $body\n}\n'
        });
    });
});
