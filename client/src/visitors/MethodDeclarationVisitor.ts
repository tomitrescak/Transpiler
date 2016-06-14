import { VariableHolderVisitor } from './VariableDeclarationFragmentVisitor';
import BlockVisitor from './BlockVisitor';
import NameFactory from './factories/NameFactory';
import TypeFactory from './factories/TypeFactory';
import TypeParametersVisitor from './TypeParameterVisitor';
import ModifiersVisitor, { ModifierLevel} from './ModifiersVisitor';
import SingleVariableDeclarationsVisitor from './VariableDeclarationSingleVisitor';
import VariableDeclarationFragmentVisitor from './VariableDeclarationFragmentVisitor';
import Messages from '../config/Messages';

declare global {
  interface IMethodHolderVisitor extends IVisitor {
    methods: MethodDeclarationVisitor[];
  }

  interface IMethodVisitor extends IVisitor {
    name: NameVisitor;
    returnType: TypeVisitor;
    modifiers: ModifiersVisitor;
  }

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

export class MethodDeclarationVisitor extends VariableHolderVisitor<MethodDeclaration> {
  name: NameVisitor;
  returnType: TypeVisitor;
  thrownExceptions: NameVisitor[];
  typeParameters: TypeParametersVisitor;
  modifiers: ModifiersVisitor;
  parameters: SingleVariableDeclarationsVisitor;
  body: BlockVisitor;

  constructor(parent: IVisitor, node: MethodDeclaration) {
    super(parent, node, 'MethodDeclaration');

    this.variables = [];
    this.name = NameFactory.create(this, node.name);

    // function parameters created first so that block has access to their definition
    if (node.parameters.length) {
      this.parameters = new SingleVariableDeclarationsVisitor(this, node.parameters);
    }

    if (node.returnType2) {
      this.returnType = TypeFactory.create(this, node.returnType2);
    } else {
      if (!node.constructor) {
        this.addError(Messages.Errors.MissingReturnType);
      }
    }
    if (node.body) {
      this.body = new BlockVisitor(this, node.body);
    }
    this.modifiers = new ModifiersVisitor(this, node.modifiers, ['abstract', 'static', 'private', 'public', 'protected'], ModifierLevel.Function);

    // type parameters
    if (node.typeParameters.length) {
      this.typeParameters = new TypeParametersVisitor(this, node.typeParameters);
    }

    // add this method to the list of methods of the parent
    if (this.parent.node.node === 'TypeDeclaration') {
      const owner = this.parent as IMethodHolderVisitor;
      owner.methods.push(this);
    } else {
      throw new Error('Unexpected parent of method declaration: ' + this.parent.node.node);
    }
  }

  visit (builder: IBuilder) {
    // add modifiers
    if (this.modifiers) {
      this.modifiers.visit(builder);
    }

    // example: <X,Y> int[][] name(String n, int g[][], M<T> t) throws Ex {  }
    if (this.node.constructor) {
      builder.add('constructor');
    } else {
      this.name.visit(builder);
    }

    // type parameters
    if (this.typeParameters) {
      this.typeParameters.visit(builder);
    }
    console.log(this.node.node)
    // header
    builder.add('(');
    if (this.parameters) {
      this.parameters.visit(builder);
    }
    builder.add(')');

    if (this.returnType) {
      // type
      builder.add(': ');
      this.returnType.visit(builder);
    }

    builder.add(' ');

    // body
    if (this.body) {
      this.body.visit(builder);
    }
  }
}

export default MethodDeclarationVisitor;
