declare global {
  interface IHandler {
    warnings: Message[];
    infos: Message[];
    errors: Message[];

    addInfo(message: string, location: AstLocation): void;
    addError(message: (string|IMessage), location?: AstLocation): void;
    addWarning(message: (string|IMessage), location?: AstLocation): void;
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


  addInfo(message: string, location: AstLocation) {
    this.infos.push({ message, line: location.line, column: location.column });
  }


  addError(message: (string|IMessage), location: AstLocation): void {
    if (typeof(message) === 'string') {
      this.errors.push({ message: <string> message, line: location.line, column: location.column });
    } else {
      this.errors.push(<IMessage> message);
    }
  }

  addWarning(message: (string|IMessage), location: AstLocation) {
    if (typeof(message) === 'string') {
      this.warnings.push({ message: <string>message, line: location.line, column: location.column });
    } else {
      this.warnings.push(<IMessage> message);
    }
  }
}
