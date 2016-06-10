"use strict";
var cases_test_1 = require('../cases_test');
describe('Parser', function () {
    it('parses class and interface members and assigns this. qualifier', function () {
        cases_test_1.default({
            name: 'Member Access',
            file: 'cases/member_access.yaml'
        });
    });
});
