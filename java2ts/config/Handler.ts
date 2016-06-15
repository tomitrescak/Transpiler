declare global {
  interface IHandler {
    warnings: IMessage[];
    infos: IMessage[];
    errors: IMessage[];

    addInfo(message: string, line: number, column: number): void;
    addError(message: string, line: number, column: number): void;
    addWarning(message: string, line: number, column: number): void;
  }

  interface IMessage {
    file?: string;
    line: number;
    column: number;
    message: string;
  }
}

class Message implements IMessage {
    file: string;
    line: number;
    column: number;
    message: string;
}

export default class Handler implements IHandler {
  warnings: Message[];
  infos: Message[];
  errors: Message[];
  fileName: string;

  constructor(fileName?: string) {
      this.warnings = [];
      this.infos = [];
      this.errors = [];
      this.fileName = fileName;
  }


  addInfo(message: string, line: number, column: number) {
    this.infos.push({ file: this.fileName, message, line: line - 1, column: column - 1 });
  }


  addError(message: string, line: number, column: number): void {
      this.errors.push({ file: this.fileName, message: <string> message, line: line - 1, column: column - 1});
  }

  addWarning(message: string, line: number, column: number) {
    this.warnings.push({ file: this.fileName, message: <string>message, line: line - 1, column: column - 1 });
  }
}
