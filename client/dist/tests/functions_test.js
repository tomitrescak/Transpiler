"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses functions', function () {
        cases_test_1.default({
            name: 'Functions',
            file: 'cases/functions.yaml',
            template: 'class Foo {\n$body\n}\n',
            outputTemplate: 'class Foo {\n  $body\n}\n'
        });
    });
});
