class Message {
    line: number;
    column: number;
    message: string;
}

export default class Handler {
  warnings: Message[];
  infos: Message[];
  errors: Message[];

  constructor() {
      this.warnings = [];
      this.infos = [];
      this.errors = [];
  }

  addInfo(message: string, location: AstLocation) {
    this.infos.push({ message, line: location.line, column: location.column });
  }

  addError(message: string, location: AstLocation) {
    this.errors.push({ message, line: location.line, column: location.column });
  }

  addWarning(message: string, location: AstLocation) {
    this.warnings.push({ message, line: location.line, column: location.column });
  }
}
