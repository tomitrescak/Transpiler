import Visitor from './Visitor';
import Messages from '../config/Messages';
import TypeFactory from './factories/TypeFactory';
import NameFactory from './factories/NameFactory';
import ExpressionFactory from './factories/ExpressionFactory';

declare global {
  interface VariableDeclarationFragment extends AstElement {
    node: 'VariableDeclarationFragment';
    name: SimpleName;
    extraDimensions: number;
    initializer: any;
  }
}

export class VariableDeclarationFragmentVisitor extends Visitor<VariableDeclarationFragment> {
  static order = ['byte', 'short', 'int', 'long', 'float', 'double'];
  static maxValue = [128, 32768, 2147483648, 9.223372037E18, 0, 0];

  name: IVisitor;
  initialiser: IExpressionVisitor;
  type: BaseTypeNode;

  constructor(parent: IVisitor, node: VariableDeclarationFragment, typeDefinition: Types, nodeName = 'VariableDeclarationFragment') {
    super(parent, node, nodeName);

    this.name = NameFactory.create(this, node.name);
    this.type = TypeFactory.create(this, typeDefinition);

    // prepare initialiser and check for possible type clashes
    if (node.initializer) {
      this.initialiser = ExpressionFactory.create(this, node.initializer);

      const fieldType = this.type.originalName;
      const initializerType = this.initialiser.returnType;
      const fidx = VariableDeclarationFragmentVisitor.order.indexOf(fieldType);
      const iidx = VariableDeclarationFragmentVisitor.order.indexOf(initializerType);

      // check numbers
      if (fidx > -1 && iidx > -1) {
        if (fidx < iidx) {
          this.addError(Messages.Errors.TypeMismatch, initializerType, fieldType);
        }
      }

      // strings
      if (fieldType === 'String' && initializerType === 'char') {
        this.addError(Messages.Errors.TypeMismatch, initializerType, fieldType);
      }
      if (fieldType === 'char' && initializerType === 'String') {
        this.addError(Messages.Errors.TypeMismatch, initializerType, fieldType);
      }
    }
  }

  visit(builder: IBuilder) {
    const fragment = this.node;
    let extraDimensions = '';

    if (fragment.extraDimensions) {
      // adds [] from variable a[][] to type
      for (let i = 0; i < fragment.extraDimensions; i++) { extraDimensions += '[]'; }
    }

    // add padding
    builder.pad(this.indent);

    // prefix name : type = initialiser;
    this.name.visit(builder);

    // add :
    builder.add(': ');

    // add type
    this.type.visit(builder);

    // add extra dimension
    builder.add(extraDimensions);
    // add iniitliser
    builder.add(' = ');

    if (this.initialiser) {
      this.initialiser.visit(builder);
    } else {
      // initialise types to default values
      let dinitialiser = '';
      switch (this.type.name) {
        case 'number':
          dinitialiser = '0';
          break;
        default:
          dinitialiser = 'null';
      }
      builder.add(dinitialiser);
    }
  }
}
