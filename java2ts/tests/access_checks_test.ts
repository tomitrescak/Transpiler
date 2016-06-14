import runTest from '../cases_test';

describe('Parser', function() {
  it('check access to variables', function() {
    runTest({
      name: 'Access Check Test',
      file: 'cases/access_checks.yaml',
    })
  });
});
