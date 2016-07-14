import Visitor from './Visitor';import ExpressionFactory from './factories/ExpressionFactory';import NameFactory from './factories/NameFactory';import TypeParametersVisitor from './TypeParameterVisitor';import Messages from '../config/Messages';import VariableDeclarationFragmentVisitor from './VariableDeclarationFragmentVisitor';import TypeFactory from './factories/TypeFactory';const order = ['byte', 'short', 'int', 'long', 'float', 'double'];declare global {  interface StringLiteral extends AstElement {    node: 'StringLiteral';    escapedValue: string;  }  interface CharacterLiteral extends AstElement {    node: 'CharacterLiteral';    escapedValue: string;  }  // ewwerwer  interface NumberLiteral extends AstElement {    node: 'NumberLiteral';    token: string;  }  interface BooleanLiteral extends AstElement {    node: 'BooleanLiteral';    booleanValue: string;  }  interface PrefixExpression extends AstElement {    operator: string;    operand: Names;  }  interface InfixExpression extends AstElement {    node: 'InfixExpression';    operator: string;    leftOperand: NumberLiteral;    rightOperand: NumberLiteral;  }  interface ParenthesizedExpression extends AstElement {    expression: Expression;  }  interface MethodInvocation extends AstElement {    name: Names;    arguments: Expression[];    typeArguments: TypeParameter[];    expression: Expression;  }  interface SuperMethodInvocation extends MethodInvocation { }  interface ExpressionStatement extends AstElement {    expression: Expression;  }  interface FieldAccess extends AstElement {    name: Names;    expression: Expression;  }  interface IExpressionVisitor extends IVisitor {    returnType: string;    value: number;  }  interface ThisExpression extends AstElement {    qualifier: any;  }  interface SuperFieldAccess extends AstElement {    name: Names;  }  interface Assignment extends AstElement {    operator: string;    leftHandSide: Expression;    rightHandSide: Expression;  }  interface ArrayInitializer extends AstElement {    expressions: Expression[];  }  interface ClassInstanceCreation extends AstElement {    type: Types;    typeArguments: TypeParameter[];    expression: Expression;    arguments: Expression[];  }  interface ConditionalExpression extends AstElement {    expression: Expression;    thenExpression: Expression;    elseExpression: Expression;  }  interface ArrayAccess extends AstElement {    array: Expression;    index: Expression;  }  interface NullLiteral extends AstElement { }  type Expression = NumberLiteral | InfixExpression | ParenthesizedExpression | MethodInvocation;}abstract class BaseExpression<T extends AstElement> extends Visitor<T> implements IExpressionVisitor {  returnType: string;  value: number;}export class NamedExpressionVisitor extends BaseExpression<Names> implements IExpressionVisitor {  nameVisitor: NameVisitor;  constructor(parent: IVisitor, visitor: NameVisitor) {    super(parent, visitor.node as Names, null);    throw new Error('Not implemented ..');  }  visit(builder: IBuilder) {    this.nameVisitor.visit(builder);  }}export class StringLiteralVisitor extends BaseExpression<StringLiteral> implements IExpressionVisitor {  constructor(parent: IVisitor, node: StringLiteral) {    super(parent, node, 'StringLiteral');    this.returnType = 'string';  }  visit(builder: IBuilder) {    builder.add(this.node.escapedValue, this.location);  }}export class CharacterLiteralVisitor extends BaseExpression<CharacterLiteral> implements IExpressionVisitor {  constructor(parent: IVisitor, node: CharacterLiteral) {    super(parent, node, 'CharacterLiteral');    this.returnType = 'char';  }  visit(builder: IBuilder) {    builder.add(this.node.escapedValue, this.location);  }}export class NullLiteralVisitor extends BaseExpression<NullLiteral> implements IExpressionVisitor {  constructor(parent: IVisitor, node: NullLiteral) {    super(parent, node, 'NullLiteral');    this.returnType = 'Object';  }  visit(builder: IBuilder) {    builder.add('null', this.location);  }}export class NumberLiteralVisitor extends BaseExpression<NumberLiteral> implements IExpressionVisitor {  token: string;  constructor(parent: IVisitor, node: NumberLiteral) {    super(parent, node, 'NumberLiteral');    let token = this.node.token;    let typeModifier = token.charAt(token.length - 1);    if (typeModifier === 'f' || typeModifier === 'd') {      if (typeModifier === 'f') {        this.returnType = 'float';      } else if (typeModifier === 'd') {        this.returnType = 'double';      }      token = token.substring(0, token.length - 1);    } else if (token.indexOf('.') > -1) {      this.returnType = 'double';    } else {      // integer type      const val = parseInt(token, 10);      if (val >= -128 && val <= 127) {        this.returnType = 'byte';      } else if (val >= -32768 && val <= 32767) {        this.returnType = 'short';      } else if (val >= -2147483648 && val <= 2147483647) {        this.returnType = 'int';      } else {        this.returnType = 'long';      }    }    this.token = token;  }  visit(builder: IBuilder) {    // trim number modifier    builder.add(this.token, this.location);  }}const artihmeticOperators = ['<', '<=', '==', '!=', '>', '>='];export class InfixExpressionVisitor extends BaseExpression<InfixExpression> implements IExpressionVisitor {  left: IExpressionVisitor;  right: IExpressionVisitor;  nonFloatingPointType: boolean;  private _returnType: string;  constructor(parent: IVisitor, node: InfixExpression) {    super(parent, node, 'InfixExpression');    this.left = ExpressionFactory.create(this, this.node.leftOperand);    this.right = ExpressionFactory.create(this, this.node.rightOperand);  }  // in the beggining the retun value is not initialised  // by calling validate the initial value is obtaned from children  get returnType(): string {    if (this._returnType === undefined) {      this.validate();    }    return this._returnType;  }  validate() {    const { left, right } = this;    const lidx = order.indexOf(left.returnType);    const ridx = order.indexOf(right.returnType);    // detect the return type for string    if (this.node.operator === '+' && (left.returnType === 'string' || right.returnType === 'string')) {      this._returnType = 'string';    } else if (artihmeticOperators.indexOf(this.node.operator) >= 0) {      // detect arithmetic operations      this._returnType = 'boolean';    } else if (lidx > -1 && ridx > -1) {      // detect return type for numbers      if (lidx < ridx) {        this._returnType = right.returnType;      } else {        this._returnType = left.returnType;      }      // round non float types from long lower (idx of long is 4)      if (lidx < 4 && ridx < 4 && this.node.operator === '/') {        this.nonFloatingPointType = true;      }    } else {      this._returnType = left.returnType;    }    // make sure that booleans are also correctly detected    if (this.node.operator === '&&' || this.node.operator === '||') {      if (left.returnType !== 'boolean') {        this.addError(Messages.Errors.TypeMismatch, left.returnType, 'boolean');      } else if (right.returnType !== 'boolean') {        this.addError(Messages.Errors.TypeMismatch, right.returnType, 'boolean');      }    }  }  visit(builder: IBuilder) {    this.validate();    // non floating point types are wrapped with rounding    if (this.nonFloatingPointType) {      builder.add('(');    }    this.left.visit(builder);    builder.add(` ${this.node.operator} `);    this.right.visit(builder);    if (this.nonFloatingPointType) {      builder.add('|0)');    }  }}export class PrefixExpressionVisitor extends BaseExpression<PrefixExpression> implements IExpressionVisitor {  operand: IExpressionVisitor;  constructor(parent: IVisitor, node: PrefixExpression) {    super(parent, node, 'PrefixExpression');    this.operand = ExpressionFactory.create(this, this.node.operand);    this.returnType = this.operand.returnType;  }  visit(builder: IBuilder) {    builder.add(this.node.operator, this.location);    this.operand.visit(builder);    // type check that negation only works on booleans    if (this.node.operator === '!') {      if (this.operand.returnType !== 'boolean') {        this.addError(Messages.Errors.TypeMismatch, this.operand.returnType, 'boolean');      }    }    return this;  }}export class PostfixExpressionVisitor extends BaseExpression<PrefixExpression> implements IExpressionVisitor {  operand: IExpressionVisitor;  constructor(parent: IVisitor, node: PrefixExpression) {    super(parent, node, 'PostfixExpression');    this.operand = ExpressionFactory.create(this, this.node.operand);    this.returnType = this.operand.returnType;  }  visit(builder: IBuilder) {    this.operand.visit(builder);    builder.add(this.node.operator, this.location);    return this;  }}export class ParenthesizedExpressionVisitor extends BaseExpression<ParenthesizedExpression> implements IExpressionVisitor {  expression: IExpressionVisitor;  constructor(parent: IVisitor, node: ParenthesizedExpression) {    super(parent, node, 'ParenthesizedExpression');    this.expression = ExpressionFactory.create(this, this.node.expression);    this.returnType = this.expression.returnType;  }  visit(builder: IBuilder) {    builder.add('(');    this.expression.visit(builder);    builder.add(')');  }}export class BooleanLiteralVisitor extends BaseExpression<BooleanLiteral> implements IExpressionVisitor {  constructor(parent: IVisitor, node: BooleanLiteral) {    super(parent, node, 'BooleanLiteral');    this.returnType = 'boolean';  }  visit(builder: IBuilder) {    builder.add(this.node.booleanValue, this.location);  }}export class VariableReference<T extends AstElement> extends BaseExpression<T> implements IExpressionVisitor {  name: NameVisitor;  classVariable: boolean;  qualifierName: string;  private _variable: IVariableVisitor;  get returnType(): string {    if (this.variable) {      return this.variable.type.originalName;    }    return null;  }  get variable(): IVariableVisitor {    if (this._variable === undefined) {      this._variable = this.findVariable(this);    }    return this._variable;  }  findVariable(parent: IVisitor) {    // find variable in current parent    return parent.findVariableInParent(parent, this.name.name);  }  visit(builder: IBuilder) {    const variable = this.variable;    if (variable) {      // check whether it is a class variable      this.classVariable =        variable.parent.node.node !== 'MethodDeclaration' &&        (variable.parent.node.node === 'TypeDeclaration' ||          variable.parent.parent.node.node === 'TypeDeclaration');      // check whether it is a static variable      if (variable.isStatic || variable.isFinal) {        // finf the compilation name        const type = variable.owner;        this.qualifierName = type.name.name;      }    } else if (!this.findDeclaration(this.name.name)) {      // we tried to get the symbol as a class name A.b from the compilation unit and we failed      this.addError(Messages.Errors.SymbolNotFound, this.name.name);    }    // render this. if it is a class member    if (this.qualifierName) {      builder.add(this.qualifierName + '.');    } else if (this.classVariable) {      builder.add('this.');    }    // render name    this.name.visit(builder);  }}export class SimpleVariableReference extends VariableReference<SimpleName> implements IExpressionVisitor {  constructor(parent: IVisitor, node: SimpleName) {    super(parent, node, 'SimpleName');    this.name = NameFactory.create(this, node);  }}export class QualifiedVariableReference extends VariableReference<QualifiedName> implements IExpressionVisitor {  qualifier: QualifiedVariableReference;  constructor(parent: IVisitor, node: QualifiedName) {    super(parent, node, 'QualifiedName');    this.name = NameFactory.create(this, node.name);    this.qualifier = ExpressionFactory.create(this, node.qualifier) as QualifiedVariableReference;  }  findVariable(parent: IVisitor) {    const type = this.findVariableType(this);    // find type of the qualifier    if (type) {      return type.findField(this.name.name);    }    return null;  }  visit(builder: IBuilder) {    // render qualifier    this.qualifier.visit(builder);    // connect with the name    builder.add('.');    // render name    this.name.visit(builder);  }}export class MethodInvocationVisitor extends BaseExpression<MethodInvocation> implements IExpressionVisitor {  name: NameVisitor;  arguments: IExpressionVisitor[];  expression: IExpressionVisitor;  typeArguments: TypeParametersVisitor;  protected _method: IMethodVisitor;  private _returnType: string;  constructor(parent: IVisitor, node: MethodInvocation, nodeName: any = 'MethodInvocation') {    super(parent, node, nodeName);    this.name = NameFactory.create(this, node.name);    this.arguments = ExpressionFactory.createArray(this, node.arguments);    if (node.expression) {      this.expression = ExpressionFactory.create(this, node.expression);    }    this.typeArguments = new TypeParametersVisitor(this, node.typeArguments);  }  get method(): IMethodVisitor {    if (!this._method) {      let owner = this.owner;      if (this.expression) {        owner = this.findVariableType(this.expression, ['QualifiedName', 'MethodInvocation']);      }      // browse till type declaration and find the return type of this method      if (owner) {        this._method = owner.findMethod(this.name.name);        // maybe the method is in the parent        if (!this._method) {          this._method = owner.findMethodInSuperClass(this.name.name);        }      } else {        this.addError(Messages.Errors.SymbolNotFound, this.expression['name'].name);      }    }    return this._method;  }  findMethodTypeName(): string {    if (this.method) {      return this.method.returnType.originalName;    } else {      this.addError(Messages.Errors.MethodNotFound, this.name.name);      return null;      // throw new Error(Messages.Errors.MethodNotFound(this.name.name));    }  }  get returnType(): string {    if (this._returnType === undefined) {      this._returnType = this.findMethodTypeName();    }    return this._returnType;  }  visit(builder: IBuilder) {    // this.findMethodType();    // if there is no expression (prefix) before the method    // we either ad this. or static qualifier    if (this.expression) {      this.expression.visit(builder);    } else {      if (!this.method) {        this.addError(Messages.Errors.MethodNotFound, this.name.name);        return;      } else if (this.method.modifiers.isStatic) {        builder.add(this.method.owner.name.name);      } else if (this.node.node === 'SuperMethodInvocation') {        builder.add('super');      } else {        builder.add('this');      }    }    builder.add('.');    this.name.visit(builder);    builder.add('(');    builder.join(this.arguments, ',');    builder.add(')');  }}export class SuperMethodInvocationVisitor extends MethodInvocationVisitor {  constructor(parent: IVisitor, node: SuperMethodInvocation) {    super(parent, node, 'SuperMethodInvocation');  }  get method(): IMethodVisitor {    if (!this._method) {      this._method = this.owner.findMethodInSuperClass(this.name.name);    }    return this._method;  }  visit(builder: IBuilder) {    super.visit(builder);  }}export class ExpressionStatementVisitor extends Visitor<ExpressionStatement> {  expression: IExpressionVisitor;  constructor(parent: IVisitor, node: ExpressionStatement) {    super(parent, node, 'ExpressionStatement');    this.expression = ExpressionFactory.create(this, node.expression);  }  visit(builder: IBuilder) {    this.expression.visit(builder);    builder.add(';');  }}export class FieldAccessVisitor extends BaseExpression<FieldAccess> {  name: NameVisitor;  expression: IExpressionVisitor;  private _variable: IVariableVisitor;  constructor(parent: IVisitor, node: FieldAccess) {    super(parent, node, 'FieldAccess');    this.name = NameFactory.create(this, node.name);    this.expression = ExpressionFactory.create(this, node.expression);  }  get returnType(): string {    if (this.variable) {      return this.variable.type.originalName;    }    return null;  }  get variable(): IVariableVisitor {    if (this._variable === undefined) {      this._variable = this.findVariable(this);    }    return this._variable;  }  findVariable(parent: IVisitor) {    const type = this.findVariableType(this, 'FieldAccess');    // find type of the qualifier    if (type) {      const field = type.findField(this.name.name);      if (!field) {        this.addError(Messages.Errors.FieldNotFound, this.name.name, type.name.name);      }      return field;    }    return null;  }  visit(builder: IBuilder) {    // TODO: find return type and check expression a() / b() or assignment to variable    this.expression.visit(builder);    builder.add('.');    this.name.visit(builder);  }}export class ThisExpressionVisitor extends BaseExpression<ThisExpression> {  constructor(parent: IVisitor, node: ThisExpression) {    super(parent, node, 'ThisExpression');  }  visit(builder: IBuilder) {    builder.add('this');  }}export class SuperFieldAccessVisitor extends BaseExpression<SuperFieldAccess> {  name: NameVisitor;  get returnType() {    const sup = this.findSuperClass();    if (!sup) {      this.addError(Messages.Errors.NoSuperClass);    }    const variable = sup.findField(this.name.name);    if (!variable) {      this.addError(Messages.Errors.VariableNotFound, this.name.name);    } else {      return variable.type.originalName;    }    return null;  }  constructor(parent: IVisitor, node: SuperFieldAccess) {    super(parent, node, 'SuperFieldAccess');    this.name = NameFactory.create(this, node.name);  }  visit(builder: IBuilder) {    builder.add('super.');    this.name.visit(builder);  }}export class AssignmentVisitor extends BaseExpression<Assignment> {  operator: string;  leftHandSide: IExpressionVisitor;  rightHandSide: IExpressionVisitor;  get returnType() {    return this.rightHandSide.returnType;  }  constructor(parent: IVisitor, node: Assignment) {    super(parent, node, 'Assignment');    this.leftHandSide = ExpressionFactory.create(this, node.leftHandSide);    this.rightHandSide = ExpressionFactory.create(this, node.rightHandSide);    this.operator = node.operator;  }  visit(builder: IBuilder) {    // try to get the variable from the left side    let variable = this.leftHandSide['variable'] as VariableDeclarationFragmentVisitor;    if (variable) {      // check assignment to a constant      if (variable.isFinal) {        this.addError(Messages.Errors.ConstantAssignment);      }    }    const leftType = this.leftHandSide.returnType;    const rightType = this.rightHandSide.returnType;    this.checkAssignment(leftType, rightType);    this.leftHandSide.visit(builder);    builder.add(' ' + this.operator + ' ');    this.rightHandSide.visit(builder);  }}export class ArrayInitializerVisitor extends BaseExpression<ArrayInitializer> {  constructor(parent: IVisitor, node: ArrayInitializer) {    super(parent, node, 'ArrayInitializer');  }  get returnType() {    return 'Array';  }  visit(builder: IBuilder) {    builder.add('[');    builder.join(ExpressionFactory.createArray(this, this.node.expressions), ',')    builder.add(']');  }}export class ClassInstanceCreationVisitor extends BaseExpression<ClassInstanceCreation> {  type: TypeVisitor;  get returnType() {    return this.type.originalName;  }  constructor(parent: IVisitor, node: ClassInstanceCreation) {    super(parent, node, 'ClassInstanceCreation');    this.type = TypeFactory.create(this, node.type);    if (node.expression) {      this.addError(Messages.Errors.ContructorExpressionNotSupported, JSON.stringify(node.expression));    }    if (node.typeArguments.length) {      this.addError(Messages.Errors.ConstructorTypeArgumentsNotSupported);    }  }  visit(builder: IBuilder) {    // new keyword    builder.add('new ');    // type initialiser    this.type.visit(builder);    builder.add('(');    if (this.node.arguments.length) {      const args = ExpressionFactory.createArray(this, this.node.arguments);      builder.join(args, ', ');    }    builder.add(')');  }}export class ConditionalExpressionVisitor extends BaseExpression<ConditionalExpression> {  expression: IExpressionVisitor;  thenExpression: IExpressionVisitor;  elseExpression: IExpressionVisitor;  constructor(parent: IVisitor, node: ConditionalExpression) {    super(parent, node, 'ConditionalExpression');    this.expression = ExpressionFactory.create(this, node.expression);    this.thenExpression = ExpressionFactory.create(this, node.thenExpression);    this.elseExpression = ExpressionFactory.create(this, node.elseExpression);  }  get returnType() {    return this.thenExpression.returnType;  }  visit(builder: IBuilder) {    this.expression.visit(builder);    builder.add(' ? ');    this.thenExpression.visit(builder);    builder.add(' : ');    this.elseExpression.visit(builder);  }}export class ArrayAccessVisitor extends BaseExpression<ArrayAccess> {  index: IExpressionVisitor;  array: IExpressionVisitor;  constructor(parent: IVisitor, node: ArrayAccess) {    super(parent, node, 'ArrayAccess');    this.index = ExpressionFactory.create(this, node.index);    this.array = ExpressionFactory.create(this, node.array);  }  get returnType() {    return this.array.returnType;  }  visit(builder: IBuilder) {    this.array.visit(builder);    builder.add('[');    this.index.visit(builder);    builder.add(']');  }}