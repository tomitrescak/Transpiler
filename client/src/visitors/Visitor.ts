import SourceMap from '../config/SourceMap';
import Handler from '../config/Handler';
import Messages from '../config/Messages';
import leftPad from '../config/LeftPad';

declare global {
  interface AstNode {
    node: string;
    line: number;
  }
}

abstract class Visitor {

  static sourceMap: SourceMap;
  static handler: Handler;
  static messages = Messages;

  static Warnigns = Messages.Warnings;
  static Errors = Messages.Errors;
  static Infos = Messages.Infos;

  parent: Visitor;
  _indent: number;

  // static bits

  static checkNode(node: AstNode, expectedNames: string | string[]) {
    if (Array.isArray(expectedNames)) {
      if (expectedNames.indexOf(node.node) === -1) {
        throw new Error(`Unexpected node '${node.node}' expected '${expectedNames.join()}'`);
      }
    }
    if (node.node !== expectedNames) {
      throw new Error(`Unexpected node '${node.node}' expected '${expectedNames}'`);
    }
  }

  static join(array: string[], joinWith = ', ', append = '') {
    if (array && array.length) {
      return array.join(joinWith) + append;
    }
    return '';
  }

  static addInfo(message: string, line: number, column = 0) {
    Visitor.handler.addInfo(message, line, column );
  }

  static addError(message: string, line: number, column = 0) {
    Visitor.handler.addError(message, line, column);
  }

  static addWarning(message: string, line: number, column = 0) {
    Visitor.handler.addWarning(message, line, column);
  }

  constructor(parent: Visitor) {
    this.parent = parent;
  }

  pad(text = '') {
    return leftPad(text, this.indent);
  }

  incIndent() {
    this.indent += 2;
  }

  set indent(ind: number) {
    this._indent = ind;
  }

  get indent() {
    if (this._indent) {
      return this._indent;
    } else if (this.parent) {
      return this.parent.indent;
    }
    return 0;
  }

  abstract visit(node: AstNode | AstNode[]): string;
}

export default Visitor;
