declare global {
  interface AstElement {
    node: string;
    location: AstLocation;
  }

  interface AstLocation {
    line: number;
    column: number;
  }

  interface IVisitor {
    parent: IVisitor;
    node: AstElement;
    indent: number;
    handler: IHandler;

    addError(error: Function, ...args: any[]): void;
    addErrorAtLocation(location: AstLocation, error: Function, ...args: any[]): void;
    addWarning(error: Function, ...args: any[]): void;
    addWarningAtLocation(location: AstLocation, error: Function, ...args: any[]): void;
    visit(builder: IBuilder, ...args: any[]): void;
  }
}

abstract class Visitor<T extends AstElement> implements IVisitor {
  parent: IVisitor;
  node: T;
  _indent: number;
  handler: IHandler;


  // static bits

  abstract visit(builder: IBuilder, ...args: any[]): void;

  // constructor

  constructor(parent: IVisitor, node: T, nodeName: string) {
    this.check(node, nodeName);
    this.parent = parent;
    this.node = node;
  }

  // properties

  get location() {
    return this.node.location;
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

  // methods

  public incIndent() {
    this.indent += 2;
  }

  public addError(error: Function, ...args: any[]) {
    if (!this.handler) {
      this.parent.addErrorAtLocation(this.location, error, ...args);
      return;
    }
    this.handler.addError(error(...args), this.location.line, this.location.column);
  }

  public addErrorAtLocation(location: AstLocation, error: Function, ...args: any[]) {
    if (!this.handler) {
      this.parent.addErrorAtLocation(location, error, ...args);
      return;
    }
    this.handler.addError(error(...args), location.line, location.column);
  }

  public addWarning(warning: Function, ...args: any[]) {
    if (!this.handler) {
      this.parent.addWarningAtLocation(this.location, warning, args);
      return;
    }
    this.handler.addWarning(warning(args), this.location.line, this.location.column);
  }

  public addWarningAtLocation(location: AstLocation, warning: Function, ...args: any[]) {
    if (!this.handler) {
      this.parent.addWarningAtLocation(location, warning, args);
      return;
    }
    this.handler.addWarning(warning(args), location.line, location.column);
  }

  /**
   * Checks the current name of the node, in case of failure it throws an exception
   * @param  {AstElement | AstElement[]}   node          [description]
   * @param  {string  | string[]}    expectedNames [description]
   */
  protected check(node: AstElement | AstElement[], expectedNames: string | string[]): void {
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
