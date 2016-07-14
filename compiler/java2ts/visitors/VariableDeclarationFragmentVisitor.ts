import Visitor from './Visitor';
import Messages from '../config/Messages';
import TypeFactory from './factories/TypeFactory';
import NameFactory from './factories/NameFactory';
import ExpressionFactory from './factories/ExpressionFactory';

declare global {
  interface IVariableHolderVisitor extends IVisitor {
    variables: VariableDeclarationFragmentVisitor[];
    findVariable(name: string): IVariableVisitor;
  }

  interface IVariableVisitor extends IVisitor {
    name: NameVisitor;
    type: TypeVisitor;
    isStatic: boolean;
    isFinal: boolean;
  }

  interface VariableDeclarationFragment extends AstElement {
    node: 'VariableDeclarationFragment' | 'SingleVariableDeclaration';
    name: SimpleName;
    extraDimensions: number;
    initializer: any;
  }
}

export abstract class VariableHolderVisitor<T extends AstElement> extends Visitor<T> implements IVariableHolderVisitor {
  variables: VariableDeclarationFragmentVisitor[] = [];

  findVariable(name: string): IVariableVisitor {
    return this.variables.find((m) => m.name.name === name);
  }
}

export class VariableDeclarationFragmentVisitor extends Visitor<VariableDeclarationFragment> implements IVariableVisitor {
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

    const variableHolder = this.findParent(['TypeDeclaration', 'MethodDeclaration', 'Block']) as IVariableHolderVisitor;
    variableHolder.variables.push(this);
  }

  validate() {
    if (!this.initialiser) {
      return;
    }

    const fieldType = this.type.originalName;
    const initializerType = this.initialiser.returnType;
    this.checkAssignment(fieldType, initializerType);
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

      if (this.initialiser) {
        // add iniitliser
        builder.add(' = ');

        this.initialiser.visit(builder);
      } else if (!this.owner.interface && !this.owner.isAbstract) {
        // add iniitliser
        builder.add(' = ');

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

    if (builder.handler.errors.length === 0) {
      this.validate();
    }
  }
}

export default VariableDeclarationFragmentVisitor;
