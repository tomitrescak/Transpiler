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

  static newLine() {
    Visitor.sourceMap.inc();
    return '\n';
  }

  constructor(parent: Visitor) {
    this.parent = parent;
  }

  // properties

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

  // methods

  public pad(text = '') {
    return leftPad(text, this.indent);
  }

  public incIndent() {
    this.indent += 2;
  }

  protected check(node: AstNode | AstNode[], nodeName: string, ...args: any[]): string {
    if (Array.isArray(node)) {
      return;
    }

    // check on the correct node name
    Visitor.checkNode(node, nodeName);

    if (node.line !== null && node.line !== undefined) {
      Visitor.sourceMap.setLine(node);
    }
  }

  abstract visit(node: AstNode | AstNode[], ...args: any[]): string;
}



export default Visitor;
