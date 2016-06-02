import Visitor from './Visitor';
import { ModifiersVisitor } from './ModifiersVisitor';
import NameVisitor from './NameVisitor';
import { TypeParametersVisitor } from './TypeParameterVisitor';
import { TypeVisitor, TypesVisitor } from './TypesVisitor';
import BodyDeclarationsVisitor from './BodyDeclareationsVisitor';

declare global {
  interface TypeDeclaration extends AstNode {
    node: 'TypeDeclaration';
    bodyDeclarations: any[];
    interface: boolean;
    modifiers: (Modifier | MarkerAnnotation)[];
    name: SimpleName;
    superInterfaceTypes: (SimpleType | ParametrizedType)[];
    superClassType: SimpleType | ParametrizedType;
    typeParameters: TypeParameter[];
  }
}

export class TypeDeclarationsVisitor extends Visitor {
  visit(types: TypeDeclaration[]): string {
    return types.map((type) => new TypeDeclarationVisitor(this.parent).visit(type)).join('\n');
  }
}

export class TypeDeclarationVisitor extends Visitor {
  visit(node: TypeDeclaration): string {
    // assign source map
    Visitor.sourceMap.setLine(node);

    // increase padding
    this.incIndent();

    // visit all children

    let children = '';
    if (node.bodyDeclarations.length) {
      // we append new line after the initial bracket '{\n'
      children = '\n';
      // let sourcemap know
      Visitor.sourceMap.inc();
      // render children
      children += new BodyDeclarationsVisitor(this).visit(node.bodyDeclarations); // wrap children with new lines
    }

    const modifiers = node.modifiers ? new ModifiersVisitor(this).visit(node.modifiers, ['abstract'], ['static']) : '';
    const declarationType = node.interface ? 'interface' : 'class';
    const name = new NameVisitor(this).visit(node.name);
    const typeParameters = node.typeParameters ? new TypeParametersVisitor(this).visit(node.typeParameters) : '';
    const superClass = node.superClassType ? (' extends ' + new TypeVisitor(this).visit(node.superClassType)) : '';
    const superInterfaceTypes = node.superInterfaceTypes.length ? (' implements ' + new TypesVisitor(this).visit(node.superInterfaceTypes)) : '';

    // the type declaration edns with a new line
    Visitor.sourceMap.inc();

    /**
     * abstract class Foo<M extends T> extends Bar implements IBar, IMar
     */
    return `${this.parent.pad()}${modifiers}${declarationType} ${name}${typeParameters}${superClass}${superInterfaceTypes} {${children}}\n`;
  }
}
