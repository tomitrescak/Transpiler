import {expect} from 'chai';
import { compileString } from '../index';

describe('Parser', function() {
  it('checks correct types', () => {
    const source = `
      let a: number = Math.round(6)`
    const result = compileString(source, null, null, (err) => {
      //console.log(err);
    });

    console.log(result);

    expect(true).to.equal(false);
  });
});
