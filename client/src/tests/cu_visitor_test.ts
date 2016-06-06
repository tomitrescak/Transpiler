import {expect} from 'chai';
import Builder from '../config/Builder';
import Messages from '../config/Messages';
import Visitor from '../visitors/Visitor';
import { transpile } from '../Java2ts';

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
      index++;
      let builder = transpile(testCase.input);

      if (testCase.output) {
        expect(builder.text).to.equal(testCase.output, `Test (${index}) - ${testCase.name}`);
      }

      if (testCase.warnings) {
        expect(testCase.warnings.length, `Test (${index}) - ${testCase.name} - Warnings contain:\n${builder.handler.warnings.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`).to.equal(builder.handler.warnings.length);
        for (let warning of testCase.warnings) {
          let parts = warning.split('|');
          let messageName = builder.Warnigns[parts[0]];
          let messageLine = parseInt(parts[1], 10);

          parts.splice(0, 2); // remove the first element that is message descriptor
          let message = messageName.apply(null, parts);
          let filtered = builder.handler.warnings.filter((w => w.line === messageLine && w.message === message));

          expect(filtered.length).be.equal(1, `Test (${index}) - ${testCase.name}: Did not find [${messageLine}] ${message}\nWarnings only contain:\n${builder.handler.warnings.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`);
        }
      }

      if (testCase.errors) {
        expect(testCase.errors.length, `Test (${index}) - ${testCase.name} - Errors contain:\n${builder.handler.warnings.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`).to.equal(builder.handler.errors.length);
        for (let error of testCase.errors) {
          let parts = error.split('|');
          let messageName = builder.Errors[parts[0]];
          let messageLine = parseInt(parts[1], 10);

          parts.splice(0, 2); // remove the first element that is message descriptor
          let message = messageName.apply(null, parts);
          let filtered = builder.handler.errors.filter((w => w.line === messageLine && w.message === message));

          expect(filtered.length).be.equal(1, `Test (${index}) - ${testCase.name}: Did not find [${messageLine}] ${message}\nErrors only contain:\n${builder.handler.errors.map((w) => `[${w.line}] ${w.message}`).join('\n')}\n\n`);
        }
      }

      if (testCase.sourceMap) {
        for (let i = 0; i < testCase.sourceMap.length; i++) {
          const line = builder.sourceMap.getLine(i);
          console.log(JSON.stringify(builder.sourceMap))
          const filtered = line.filter((l) => l.mapping.row === testCase.sourceMap[i]);
          expect(filtered.length, `Test (${index}) - ${testCase.name}: Source map matching failed`).to.be.least(1);
        }
      }

      console.log('=======================================================')
    }
  });
});
