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
    CannotFindSymbol(name: string) {
      return 'Cannot find symbol: ' + name;
    },
    TypeMismatch(from: string, to: string) {
      return `Type mismatch: Cannot convert from '${from}' to '${to}'`;
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
    FieldNotFound(name: string) {
      return `Field '${name}' not found`;
    },
    MissingReturnType() {
      return `Missing return type`;
    },
    NoSuperClass() {
      return 'Class has no parent';
    }
  },
  Warnings: {
    IgnoredAnnotation() { return 'Annotations are not supported.'; },
    IgnoredModifier(modifier: string) { return `Modifier '${modifier}' is not supported.`;  }
  },
  Infos: {

  },
};
