import {expect} from 'chai';
import { java2js } from '../index';

describe('Java2Js', function() {
  it('breaks on syntax errors', () => {
    const source = `
      class A {
        int a = Math.round(6)
      }`;

    let error: { message: string} = null;
    let result: CompilationResult = null;

    try {
      result = java2js([{ name: 'File1.java', source: source }]);
    } catch (ex) {
      error = ex;
    }

    expect(result).to.be.null;
    expect(error).to.not.equal(null);
  });

  it('workd well with base library lib.d.ts', () => {
    const source = `
      class A {
        int a = Math.round(6);
      }`;
    const result = java2js([{ name: 'File1.java', source: source }]);

    console.log(result.errors);

    expect(result).to.not.be.undefined;
    expect(result.errors.length).to.equal(0);
  });
});
