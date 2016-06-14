"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('check access to variables', function () {
        cases_test_1.default({
            name: 'Access Check Test',
            file: 'cases/access_checks.yaml',
        });
    });
});
