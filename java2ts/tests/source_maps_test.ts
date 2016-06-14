import runTest from '../cases_test';

describe('Parser', function() {
  it('creates source maps', function() {
    runTest({
      name: 'Source Map Test',
      file: 'cases/source_maps.yaml',
    })
  });
});
