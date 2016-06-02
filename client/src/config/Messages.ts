export default {
  Errors: {
    DuplicateAccessor(...args: string[]) { return 'Duplicate accessors: ' + args.join(); },
    UnexpectedModifier(modifier: string) { return 'Unexpected modifier: ' + modifier; }
  },
  Warnings: {
    IgnoredAnnotation() { return 'Annotations are not supported and will be ignored'; },
    IgnoredModifier(modifier: string) { return `Modifier '${modifier}' is not supported on this level and will be ignored;`;  }
  },
  Infos: {

  },
}
