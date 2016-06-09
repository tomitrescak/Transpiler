"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses modifiers', function () {
        cases_test_1.default({
            name: 'Statements Test',
            file: 'cases/statements.yaml',
            template: 'class Foo {\n  void a(){\n    $body\n  }\n}\n',
            outputTemplate: 'class Foo {\n  a(): void {\n    $body\n  }\n}\n'
        });
    });
});
