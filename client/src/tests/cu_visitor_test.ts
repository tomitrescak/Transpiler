import {expect} from 'chai';
import CUVisitor from '../visitors/CompilationUnitVisitor';
import Messages from '../config/Messages';
import Visitor from '../visitors/Visitor';

const YAML = require('yamljs');
const parser = require('../../../imports/parser');

interface Case {
  name: string;
  description: string;
  input: string;
  output: string;
  errors: string[];
  warnings?: string[];
  infos?: string[];
  sourceMap: number[];
}

declare global {
  export var __dirname: string;
}

let cases: Case[] = YAML.load(require('path').join(__dirname, 'cases.yaml'));

describe('Parser', function() {
  it('parses classes', function() {
    let index = 0;
    for (let testCase of cases) {
      let parsed = parser.parse(testCase.input);
      let cuVisitor = new CUVisitor(null);
      let result = cuVisitor.visit(parsed);

      expect(result).to.equal(testCase.output, `Test (${index++}) - ${testCase.name}\n`);

      if (testCase.warnings) {
        expect(testCase.warnings.length).to.equal(Visitor.handler.warnings.length);
        for (let warning of testCase.warnings) {
          let parts = warning.split('|');
          let messageName = Visitor.Warnigns[parts[0]];
          let messageLine = parseInt(parts[1], 10);

          parts.splice(0, 2); // remove the first element that is message descriptor
          let message = messageName.apply(null, parts);
          let filtered = Visitor.handler.warnings.filter((w => w.line === messageLine && w.message === message));

          expect(filtered.length).be.equal(1, `Test (${index++}) - ${testCase.name}: Did not find [${messageLine}] ${message}\nWarnings only contain:\n${Visitor.handler.warnings.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`);
        }
      }

      if (testCase.errors) {
        expect(testCase.errors.length).to.equal(Visitor.handler.errors.length);
        for (let error of testCase.errors) {
          let parts = error.split('|');
          let messageName = Visitor.Errors[parts[0]];
          let messageLine = parseInt(parts[1], 10);

          parts.splice(0, 2); // remove the first element that is message descriptor
          let message = messageName.apply(null, parts);
          let filtered = Visitor.handler.errors.filter((w => w.line === messageLine && w.message === message));

          expect(filtered.length).be.equal(1, `Test (${index++}) - ${testCase.name}: Did not find [${messageLine}] ${message}\nErrors only contain:\n${Visitor.handler.errors.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`);
        }
      }

      if (testCase.sourceMap) {
        for (let i = 0; i < testCase.sourceMap.length; i++) {
          console.log(Visitor.sourceMap)
          expect(Visitor.sourceMap.getLine(i), `Source map matching failed`).to.equal(testCase.sourceMap[i])
        }
      }
    }
  });
});
