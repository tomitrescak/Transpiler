import runTest from '../cases_test';

describe('Parser', function() {
  it('parses modifiers', function() {
    runTest({
      name: 'Statements Test',
      file: 'cases/statements_check.yaml',
      template: 'class Foo {\n  $body\n  }\n',
      outputTemplate: 'class Foo {\n  $body\n  }\n'
    })
  });
});
