import Visitor from './Visitor';
import BlockVisitor from './BlockVisitor';
import NameFactory from './factories/NameFactory';
import TypeFactory from './factories/TypeFactory';
import TypeParametersVisitor from './TypeParameterVisitor';
import ModifiersVisitor from './ModifiersVisitor';
import SingleVariableDeclarationsVisitor from './VariableDeclarationSingleVisitor';

declare global {
  interface MethodDeclaration extends AstElement {
    node: 'MethodDeclaration';
    typeParameters: TypeParameter[];
    parameters: SingleVariableDeclaration[];
    modifiers: Modifiers[];
    name: SimpleName;
    returnType2: Types;
    constructor: boolean;
    body: Block;
    thrownExceptions: Names[];
  }
}

export class MethodDeclarationVisitor extends Visitor<MethodDeclaration> {
  name: NameVisitor;
  returnType: TypeVisitor;
  thrownExceptions: NameVisitor[];
  typeParameters: TypeParametersVisitor;
  modifiers: ModifiersVisitor;
  parameters: SingleVariableDeclarationsVisitor;
  body: BlockVisitor;

  constructor(parent: IVisitor, node: MethodDeclaration) {
    super(parent, node, 'MethodDeclaration');

    this.name = NameFactory.create(this, node.name);

    this.returnType = TypeFactory.create(this, node.returnType2);
    if (node.body) {
      this.body = new BlockVisitor(this, node.body);
    }
    this.modifiers = new ModifiersVisitor(this, node.modifiers);

    // type parameters
    if (node.typeParameters.length) {
      this.typeParameters = new TypeParametersVisitor(this, node.typeParameters);
    }

    // function parameters
    if (node.parameters.length) {
      this.parameters = new SingleVariableDeclarationsVisitor(this, node.parameters);
    }
  }

  visit (builder: IBuilder) {
    // add indentation
    builder.pad(this.indent);

    // add modifiers
    this.modifiers.visit(builder);

    // example: <X,Y> int[][] name(String n, int g[][], M<T> t) throws Ex {  }
    this.name.visit(builder);

    // type parameters
    if (this.typeParameters) {
      this.typeParameters.visit(builder);
    }

    // header
    builder.add('(');
    if (this.parameters) {
      this.parameters.visit(builder);
    }
    builder.add(')');

    // type
    builder.add(': ');
    this.returnType.visit(builder);
    builder.add(' ');

    // body
    if (this.body) {
      this.body.visit(builder);
    }
  }
}
