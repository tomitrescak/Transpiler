"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses modifiers', function () {
        cases_test_1.default({
            name: 'Statements Test',
            file: 'cases/statements_check.yaml',
            template: 'class Foo {\n  $body\n  }\n',
            outputTemplate: 'class Foo {\n  $body\n  }\n'
        });
    });
});
