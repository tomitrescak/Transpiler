import Visitor from './Visitor';
import Builder from '../config/Builder';
import SourceMap from '../config/SourceMap';
import CompilationUnitVisitor from './CompilationUnitVisitor';

const parser = require('../../pegjs/parser');

declare global {
  interface Map<T> {
    [index: string]: T;
  }

  interface ICompilationBundleVisitor extends IVisitor {
    units: IBundleFile[];
    findDeclaration(name: string): ITypeDeclarationVisitor;
  }

  interface IBundleFile {
    name: string;
    source: string;
    result?: string;
    version?: number;
    tree?: any;
    unit?: ICompilationUnitVisitor;
  }

  interface ICompiledFile {
    version?: number;
    name?: string;
    source?: string;
    result?: string;
  }

  interface ICompilationResult {
    files: Map<ICompiledFile>;
    warnings: IMessage[];
    errors: IMessage[];
    sourceMap?: SourceMap;
  }
}

export default class CompilationBundleVisitor extends Visitor<any> implements ICompilationBundleVisitor {
  units: IBundleFile[];

  constructor() {
    super(null, null, null);
    this.units = [];
  }

  compile(cfile: IBundleFile, parseOnly = false): ICompilationResult {
    let compilationResult: ICompilationResult = {
      errors: [],
      warnings: [],
      files: {}
    };

    // we either create a new file or modify existing one
    let file = this.units.find((u) => u.name === cfile.name);
    if (!file) {
      file = {
        name: cfile.name,
        source: cfile.source,
        version: 0
      };
      this.units.push(file);
    } else {
      file.source = cfile.source;
      file.result = null;
      file.tree = null;
    }

    // create a new version
    file.version++;

    // build file
    const builder = new Builder(null, file.name);

    // first parse
    try {
      file.tree = parser.parse(file.source);
      file.unit = new CompilationUnitVisitor(this, file.tree, builder.handler);
    } catch (ex) {
      if (!ex.location) {
        compilationResult.errors.push({
          file: file.name,
          line: 0,
          column: 0,
          message: ex.message
        });
        console.error(ex.message);
        console.error(ex.stack);
        return;
      }
      compilationResult.errors.push({
        file: file.name,
        line: ex.location.start.line - 1,
        column: ex.location.start.column - 1,
        message: ex.found ? (`Unexpected '${ex.found}': ${ex.message.substring(0, 40)}...`) : ex.message
      });
    }

    // return in case of errors
    if (parseOnly || compilationResult.errors.length) {
      return compilationResult;
    }

    // second compile
    try {
      file.unit.visit(builder);

      // read result text
      file.result = builder.text;

      // read result
      compilationResult.errors = compilationResult.errors.concat(builder.handler.errors);
      compilationResult.warnings = compilationResult.warnings.concat(builder.handler.warnings);
      compilationResult.sourceMap = builder.sourceMap;
    } catch (ex) {
      compilationResult.errors.push({
        file: file.name,
        line: 0,
        column: 0,
        message: ex
      });
      throw ex;
    }

    // compilationResult.files = this.units.map((u) => {
    //   return {
    //     name: u.name,
    //     source: u.result,
    //     changed: u.changed,
    //     version: u.version
    //   };
    // });

    compilationResult.files['changed'] = {
      name: file.name,
      source: file.result,
      version: file.version,
    };

    return compilationResult;
  }

  visit(builder: IBuilder) { /* */ }

  findDeclaration(name: string): ITypeDeclarationVisitor {
    for (let file of this.units) {
      const dec = file.unit.findDeclaration(name);
      if (dec) {
        return dec;
      }
    }
    return null;
  }
}
