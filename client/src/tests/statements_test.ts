import runTest from '../cases_test';

describe('Parser', function() {
  it('parses modifiers', function() {
    runTest({
      name: 'Statements Test',
      file: 'cases/statements.yaml',
      template: 'class Foo {\n  void a(){\n    $body\n  }\n}\n',
      outputTemplate: 'class Foo {\n  a(): void {\n    $body\n  }\n}\n'
    })
  });
});
