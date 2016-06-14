import runTest from '../cases_test';

describe('Parser', function() {
  it('parses class and interface members and assigns this. qualifier', () => {
    runTest({
      name: 'Member Access',
      file: 'cases/member_access.yaml'
    });
  });
});
