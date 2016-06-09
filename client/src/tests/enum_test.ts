import runTest from '../cases_test';

describe('Parser', function() {
  it('parses enums', function() {
    runTest({
      name: 'Enum Test',
      file: 'cases/enum_declaration.yaml',
    })
  });
});
