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
    }
  },
  Warnings: {
    IgnoredAnnotation() { return 'Annotations are not supported.'; },
    IgnoredModifier(modifier: string) { return `Modifier '${modifier}' is not supported.`;  }
  },
  Infos: {

  },
};
