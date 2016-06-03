import CompilationUnitVisitor from '../visitors/CompilationUnitVisitor';
import Visitor from '../visitors/Visitor';
import SourceMap from '../config/SourceMap';
import Messages from '../config/Messages';
import Handler from './Handler';

export default class Builder {

  static Warnigns = Messages.Warnings;
  static Errors = Messages.Errors;
  static Infos = Messages.Infos;

  static sourceMap: SourceMap;
  static handler: Handler;

  static currentLine: number;
  static currentColumn: number;

  static lineText: string;
  static text: string;

  static addLine() {
    Builder.add('\n');
  }

  static add(text: string, node: AstNode = null) {
    // add to current text
    Builder.text += text;

    // count how many new line characters are there
    let nls = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\n') { nls++ };
    }

    if (node) {
      // console.log(node)
      Builder.sourceMap.setLine(
        Builder.currentLine,
        Builder.currentColumn,
        node.location.line,
        node.location.column);
    }

    // we start a new column if it was detected
    // if it was a last column we add what is remaming after the '\n' symbol
    Builder.currentColumn = nls === 0 ?
      Builder.currentColumn + text.length : // same line
      text.substring(text.lastIndexOf('\n')).length; // new line
    Builder.currentLine += nls;
  }

  static join(array: AstNode[], joinFunc: Function, joinWith = ', ', append = '') {
    if (array && array.length) {
      for (let i = 0; i < array.length; i++) {
        joinFunc(array[i]);

        // add separator
        if (i < array.length - 1) {
          Builder.add(joinWith);
        }
      }
      if (append) {
        Builder.add(append);
      }
    }
  }

  static addInfo(message: string, location: AstLocation) {
    Builder.handler.addInfo(message, location);
  }

  static addError(message: string, location: AstLocation) {
    Builder.handler.addError(message, location);
  }

  static addWarning(message: string, location: AstLocation) {
    Builder.handler.addWarning(message, location);
  }

  // static methods


  static build(cu: CompilationUnit, sourceMapIn?: SourceMap, handlerIn?: Handler) {
    Builder.sourceMap = sourceMapIn ? sourceMapIn : new SourceMap();
    Builder.handler = handlerIn ? handlerIn : new Handler();
    Builder.text = '';
    Builder.currentLine = 0;
    Builder.currentColumn = 0;
    Builder.lineText = '';

    // init source map, reset previous run
    Builder.sourceMap.init();

    new CompilationUnitVisitor().visit(cu);

    // builder contains all the needed text
    return Builder.text;
  }
}
