declare global {
  interface IHandler {
    warnings: Message[];
    infos: Message[];
    errors: Message[];

    addInfo(message: string, line: number, column: number): void;
    addError(message: string, line: number, column: number): void;
    addWarning(message: string, line: number, column: number): void;
  }

  interface IMessage {
    line: number;
    column: number;
    message: string;
  }
}

class Message implements IMessage {
    line: number;
    column: number;
    message: string;
}

export default class Handler implements IHandler {
  warnings: Message[];
  infos: Message[];
  errors: Message[];

  constructor() {
      this.warnings = [];
      this.infos = [];
      this.errors = [];
  }


  addInfo(message: string, line: number, column: number) {
    this.infos.push({ message, line: line - 1, column: column - 1 });
  }


  addError(message: string, line: number, column: number): void {
      this.errors.push({ message: <string> message, line: line - 1, column: column - 1});
  }

  addWarning(message: string, line: number, column: number) {
    this.warnings.push({ message: <string>message, line: line - 1, column: column - 1 });
  }
}
