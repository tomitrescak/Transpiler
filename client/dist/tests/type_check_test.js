"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('checks correct types', function () {
        cases_test_1.default({
            name: 'Type Checks Test',
            file: 'cases/type_checks.yaml',
            template: 'class Foo {\n$body\n}\n',
            outputTemplate: 'class Foo {\n  $body\n}\n'
        });
    });
});
