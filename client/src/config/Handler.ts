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

  addInfo(message: string, line: number, column = 0) {
    this.infos.push({ message, line, column });
  }

  addError(message: string, line: number, column = 0) {
    this.errors.push({ message, line, column });
  }

  addWarning(message: string, line: number, column = 0) {
    this.warnings.push({ message, line, column });
  }
}
