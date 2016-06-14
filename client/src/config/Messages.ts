export default {
  Errors: {
    DuplicateAccessor(...args: string[]) {
      return 'Duplicate accessors: ' + args.join();
    },
    UnexpectedModifier(modifier: string) {
      return 'Unexpected modifier: ' + modifier;
    },
    SimpleEnumsOnlySupported() {
      return 'Only simple enums are supported';
    },
    SymbolNotFound(name: string) {
      return 'Cannot find symbol: ' + name;
    },
    TypeMismatch(from: string, to: string) {
      return `Type mismatch: Cannot convert from '${from}' to '${to}'`;
    },
    ConditionTypeMismatch(from: string, to: string) {
      return `Condition type mismatch: Cannot convert from '${from}' to boolean`;
    },
    AssignTypeMismatch(from: string, to: string) {
      return `Incorrect assignment: Cannot assign '${from}' to '${to}'`;
    },
    MethodNotFound(name: string) {
      return `Method '${name}' not found`;
    },
    VariableNotFound(name: string) {
      return `Variable '${name}' not found`;
    },
    TypeNotFound(name: string) {
      return `Type '${name}' not found`;
    },
    FieldNotFound(name: string, typeName: string) {
      return `Field '${name}' not found on type '${typeName}'`;
    },
    MissingReturnType() {
      return `Missing return type`;
    },
    NoSuperClass() {
      return 'Class has no parent';
    },
    ConstantAssignment() {
      return 'Cannot assign value to a constant';
    },
    LabelsNotSupported() {
      return 'Labels are not supported';
    },
    TryResourcesNotSupported() {
      return 'Try statement resources are not supported';
    },
    MoreCatchClausesNotSupported() {
      return 'Only one catch clause is supported';
    }
  },
  Warnings: {
    IgnoredAnnotation() { return 'Annotations are not supported.'; },
    IgnoredModifier(modifier: string) { return `Modifier '${modifier}' is not supported.`;  }
  },
  Infos: {

  },
};
