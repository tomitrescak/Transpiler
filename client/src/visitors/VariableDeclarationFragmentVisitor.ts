import Visitor from './Visitor';
import Messages from '../config/Messages';
import TypeFactory from './factories/TypeFactory';
import NameFactory from './factories/NameFactory';
import ExpressionFactory from './factories/ExpressionFactory';

declare global {
  interface VariableHolderVisitor extends IVisitor {
    variables: VariableDeclarationFragmentVisitor[];
  }

  interface VariableDeclarationFragment extends AstElement {
    node: 'VariableDeclarationFragment' | 'SingleVariableDeclaration';
    name: SimpleName;
    extraDimensions: number;
    initializer: any;
  }
}

export class VariableDeclarationFragmentVisitor extends Visitor<VariableDeclarationFragment> {
  static order = ['byte', 'short', 'int', 'long', 'float', 'double'];
  static maxValue = [128, 32768, 2147483648, 9.223372037E18, 0, 0];

  name: NameVisitor;
  initialiser: IExpressionVisitor;
  type: TypeVisitor;
  isStatic: boolean;
  isFinal: boolean;

  constructor(parent: IVisitor, node: VariableDeclarationFragment, typeDefinition: Types, isStatic: boolean, isFinal: boolean, nodeName = 'VariableDeclarationFragment') {
    super(parent, node, nodeName);
    this.name = NameFactory.create(this, node.name);
    this.type = TypeFactory.create(this, typeDefinition);
    this.isStatic = isStatic;
    this.isFinal = isFinal;

    // prepare initialiser and check for possible type clashes
    if (node.initializer) {
      this.initialiser = ExpressionFactory.create(this, node.initializer);
    }

    // add this method to the list of methods of the parent

    const variableHolder = this.findParent(['TypeDeclaration', 'MethodDeclaration', 'Block']) as VariableHolderVisitor;
    variableHolder.variables.push(this);
  }

  validate() {
    if (!this.initialiser) {
      return;
    }

    const fieldType = this.type.originalName;
    const initializerType = this.initialiser.returnType;
    const fidx = VariableDeclarationFragmentVisitor.order.indexOf(fieldType);
    const iidx = VariableDeclarationFragmentVisitor.order.indexOf(initializerType);

    // console.log('ITYPE: ' + initializerType)

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

  visit(builder: IBuilder, lineDeclaration = true) {
    const fragment = this.node;
    let extraDimensions = '';

    if (fragment.extraDimensions) {
      // adds [] from variable a[][] to type
      for (let i = 0; i < fragment.extraDimensions; i++) { extraDimensions += '[]'; }
    }

    // prefix name : type = initialiser;
    this.name.visit(builder);

    // add :
    builder.add(': ');

    // add type
    this.type.visit(builder);

    // add extra dimension
    builder.add(extraDimensions);

    // line declarations have extra stuff such as initialiser
    if (lineDeclaration) {

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
          case 'boolean':
            dinitialiser = 'false';
            break;
          default:
            dinitialiser = 'null';
        }
        builder.add(dinitialiser);
      }
    }

    this.validate();
  }
}

export default VariableDeclarationFragmentVisitor;
