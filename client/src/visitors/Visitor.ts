import leftPad from '../config/LeftPad';

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
    owner: ITypeDeclarationVisitor;
    compilationUnit: ICompilationUnitVisitor;


    addError(error: Function, ...args: any[]): void;
    addErrorAtLocation(location: AstLocation, error: Function, ...args: any[]): void;
    addWarning(error: Function, ...args: any[]): void;
    addWarningAtLocation(location: AstLocation, error: Function, ...args: any[]): void;
    visit(builder: IBuilder, ...args: any[]): void;
    findParent(names: string[] | string): IVisitor;
    findSuperClass(): ITypeDeclarationVisitor;
    findVariableInSuperClass(name: string): IVariableVisitor;
    findVariableInParent(parent: IVisitor, name: string): IVariableVisitor;
  }
}

abstract class Visitor<T extends AstElement> implements IVisitor {
  parent: IVisitor;
  node: T;
  _indent: number;
  handler: IHandler;


  // static bits

  findSuperClass(): ITypeDeclarationVisitor {
    const owner = this.owner; // that's the compilation unit
    if (!owner.superClassType) {
      return null;
    }
    return owner.compilationUnit.findDeclaration(owner.superClassType);
  }

  findVariableInSuperClass(name: string): IVariableVisitor {
    const superClass = this.findSuperClass();
    if (!superClass) {
      return null;
    }
    return superClass.findVariable(name);
  }

  findVariableInParent(parent: IVisitor, name: string): IVariableVisitor {
    // find if name exists in the parent scope
    let vh = <IVariableHolderVisitor> parent;
    if (vh.variables && vh.variables.length) {
      let variable = vh.findVariable(name);
      if (variable) {
        return variable;
      }
    }
    if (parent.parent.node.node !== 'CompilationUnit') {
      return this.findVariableInParent(parent.parent, name);
    } else {
      return this.findVariableInSuperClass(name);
    }
  }

  // absstrcat bits

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

  get owner(): ITypeDeclarationVisitor {
    return this.findParent('TypeDeclaration') as ITypeDeclarationVisitor;
  }

  get compilationUnit(): ICompilationUnitVisitor {
    return this.findParent('CompilationUnit') as ICompilationUnitVisitor;
  }

  // methods

  public incIndent() {
    this.indent += 2;
  }

  public pad(): string {
    return leftPad('', this.indent);
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

  public findParent(names: string[] | string): IVisitor {
    let parent = this;
    if (parent == null) {
      throw new Error('Parent not found: ' + names);
    }
    if (Array.isArray(names)) {
      if (names.indexOf(parent.node.node) > -1) {
        return parent;
      }
    } else {
      if (names === parent.node.node) {
        return parent;
      }
    }

    return this.parent.findParent(names);
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
