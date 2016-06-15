import {expect} from 'chai';
//import { compileString } from '../compiler';
import { serviceCompile, initService} from '../index';

// describe('Parser', function() {
//   it('checks correct types', () => {
//     const source = `
//       let a: number = Math.round(6)`
//     const result = compileString(source, null, null, (err) => {
//       //console.log(err);
//     });
//
//     console.log(result);
//
//     //expect(true).to.equal(false);
//   });
// });

describe('Parser', function() {
  it('watches files', () => {

    // start the service
    initService([]);

    const file = { name: 'file1.ts', source: `let a: number = "1"` };
    let result = serviceCompile(file);

    expect(result.errors.length).to.equal(1);

    file.source = `let a: number = 1`;
    result = serviceCompile(file);

    expect(result.errors.length).to.equal(0);

  });
});
