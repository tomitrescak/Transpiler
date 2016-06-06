import Builder from '../config/Builder';

declare global {
  interface AstNode {
    node: string;
    location: AstLocation;
  }

  interface AstLocation {
    line: number;
    column: number;
  }

  interface IVisitor {
    parent: IVisitor;
    node: AstNode;
    indent: number;
  }
}

abstract class Visitor {
  parent: Visitor;
  node: AstNode;
  _indent: number;

  // static bits

  abstract visit(node: AstNode | AstNode[], ...args: any[]): void;

  // constructor

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

  public incIndent() {
    this.indent += 2;
  }

  public error(error: Function, ...args: any[]) {
    Builder.addError(error.apply(null, args), this.node.location);
  }

  public warning(warning: Function, ...args: any[]) {
    Builder.addWarning(warning.apply(null, args), this.node.location);
  }

  /**
   * Checks the current name of the node, in case of failure it throws an exception
   * @param  {AstNode | AstNode[]}   node          [description]
   * @param  {string  | string[]}    expectedNames [description]
   */
  protected check(node: AstNode | AstNode[], expectedNames: string | string[]): void {
    if (Array.isArray(node)) {
      return;
    }
    if (Array.isArray(expectedNames)) {
      if (expectedNames.indexOf(node.node) === -1) {
        throw new Error(`Unexpected node '${node.node}' expected '${expectedNames.join()}'`);
      }
    }
    if (node.node !== expectedNames) {
      throw new Error(`Unexpected node '${node.node}' expected '${expectedNames}'`);
    }
  }
}

export default Visitor;
