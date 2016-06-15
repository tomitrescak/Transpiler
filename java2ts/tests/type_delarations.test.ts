import runTest from '../cases_test';

describe('Parser', function() {
  it('parses type declarations', function() {
    runTest({
      name: 'General Test',
      file: 'cases/type_declaration.yaml',
    })
  });
});
