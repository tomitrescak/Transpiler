import leftPad from '../config/LeftPad';
import Messages from '../config/Messages';

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
    //compilationUnit: ICompilationUnitVisitor;


    addError(error: Function, ...args: any[]): void;
    addErrorAtLocation(location: AstLocation, error: Function, ...args: any[]): void;
    addWarning(error: Function, ...args: any[]): void;
    addWarningAtLocation(location: AstLocation, error: Function, ...args: any[]): void;
    visit(builder: IBuilder, ...args: any[]): void;
    findParent(names: string[] | string): IVisitor;
    findSuperClass(): ITypeDeclarationVisitor;
    findVariableInSuperClass(name: string): IVariableVisitor;
    findVariableInParent(parent: IVisitor, name: string): IVariableVisitor;
    findDeclaration(name: string): ITypeDeclarationVisitor;
  }
}

abstract class Visitor<T extends AstElement> implements IVisitor {
  static order = ['byte', 'short', 'int', 'long', 'float', 'double'];
  static maxValue = [128, 32768, 2147483648, 9.223372037E18, 0, 0];

  parent: IVisitor;
  node: T;
  _indent: number;
  handler: IHandler;

  // static bits

  findMethodType(visitor: IVisitor) {
    const child = visitor['expression'];
    const name = visitor['name'] ? visitor['name'].name : null;

    if (child) {
      // child can be field access or just a qualified name
      const callChildName = child.node.node === 'QualifiedName' ? 'qualifier' : 'expression';

      // find the owner type, and pass MethodInvocation as the paren of this call
      let type = this.findVariableType(child, callChildName, 'MethodInvocation');

      // now find the method in the owner and return type
      const method = type.findMethodInSuperClass(name);
      if (!method) {
        this.addError(Messages.Errors.MethodNotFound, name);
        throw new Error(Messages.Errors.MethodNotFound(name));
      }
      const typ = method.returnType.originalName;
      return this.owner.findDeclaration(typ);
    }
  }

  findVariableType(visitor: IVisitor, childName = 'qualifier', nodeName: (string | string[]) = 'QualifiedName'): ITypeDeclarationVisitor {
    const child = visitor[childName];
    const name = visitor['name'] ? visitor['name'].name : null;

    if (child) {
      // child can also be method invocation

      const callChildName = child.node.node === 'QualifiedName' ? 'qualifier' : 'expression';
      const callNodeName = child.node.node === 'QualifiedName' ? 'QualifiedName' : 'FieldAccess';

      let type = child.node.node === 'MethodInvocation' ?
        this.findMethodType(child) :
        this.findVariableType(child, callChildName, callNodeName);

      // check if type exists
      if (!type) {
        this.addError(Messages.Errors.VariableNotFound, child.name.name);
        return;
        // throw new Error(Messages.Errors.VariableNotFound(child.name.name));
      }

      // in case this is the last variable of the chain we return its type
      if (Array.isArray(nodeName) && nodeName.indexOf(visitor.parent.node.node) === -1 ||
        !Array.isArray(nodeName) && visitor.parent.node.node !== nodeName) {
        return type;
      }

      // othrwise we continue
      // find the field with this name and find its type
      const field = type.findField(name);
      if (!field) {
        return null;
      }

      // find the type declaration of this field
      const typeName = field.type.originalName;
      return this.findDeclaration(typeName);
    } else {
      // this is the end of the referecne chain {A}.b.c.d
      // A can be either a this, super, class memeber or a static reference
      if (visitor.node.node === 'ThisExpression') {
        return visitor.owner;
      }
      if (visitor.node.node === 'SuperFieldAccess') {
        // find the type of the super reference
        const field = visitor.owner.findFieldInSuperClass(name);
        if (!field) {
          return null;
        }
        const type = field.type.originalName;
        return this.findDeclaration(type);
      }
      // possible member is announced without this. expression
      let member = visitor.findVariableInParent(visitor, name);
      if (member) {
        return this.findDeclaration(member.type.originalName);
      } else {
        // otherwise is just a static expression
        return visitor.findDeclaration(name);
      }
    }
  }

  findDeclaration(name: string): ITypeDeclarationVisitor {
    // find top level visitor and find the declaration there
    let parent: IVisitor = this;
    while (parent.parent != null) {
      parent = parent.parent;
    }
    return parent.findDeclaration(name);
  }

  findSuperClass(): ITypeDeclarationVisitor {
    const owner = this.owner; // that's the compilation unit
    if (!owner.superClassType) {
      return null;
    }
    return owner.findDeclaration(owner.superClassType);
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
    let vh = <IVariableHolderVisitor>parent;
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

  // get compilationUnit(): ICompilationUnitVisitor {
  //   return this.findParent('CompilationUnit') as ICompilationUnitVisitor;
  // }

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

  public checkAssignment(left: string, right: string) {
    const fidx = Visitor.order.indexOf(left);
    const iidx = Visitor.order.indexOf(right);

    // console.log('ITYPE: ' + initializerType)

    // check numbers
    if (fidx > -1 && iidx > -1) {
      if (fidx < iidx) {
        this.addError(Messages.Errors.AssignTypeMismatch, right, left);
      }
    }

    // strings and chars
    if (left === 'String' && right === 'char') {
      this.addError(Messages.Errors.AssignTypeMismatch, right, left);
    }
    if (left === 'char' && right === 'String') {
      this.addError(Messages.Errors.AssignTypeMismatch, right, left);
    }
    // booleans
    if (left === 'boolean' && right !== 'boolean') {
      this.addError(Messages.Errors.AssignTypeMismatch, right, left);
    }
    if (right === 'boolean' && left !== 'boolean') {
      this.addError(Messages.Errors.AssignTypeMismatch, right, left);
    }
  }

  /**
   * Checks the current name of the node, in case of failure it throws an exception
   * @param  {AstElement | AstElement[]}   node          [description]
   * @param  {string  | string[]}    expectedNames [description]
   */
  protected check(node: AstElement | AstElement[], expectedNames: string | string[]): void {
    if (!node) {
      return;
    }
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
