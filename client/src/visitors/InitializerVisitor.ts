import Visitor from './Visitor';
import { NumberLiteralVisitor } from './ExpressionsVisitors';

export default class InitialiserVisitor extends Visitor {
  visit(node: AstNode): string {
    switch (node.node) {
      case 'NumberLiteral':
        return new NumberLiteralVisitor(this).visit(<NumberLiteral> node);
    }
  }
}
