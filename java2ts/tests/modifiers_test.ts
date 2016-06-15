import runTest from '../cases_test';

describe('Parser', function() {
  it('parses modifiers', function() {
    runTest({
      name: 'Modifer Test',
      file: 'cases/modifiers.yaml',
    })
  });
});
