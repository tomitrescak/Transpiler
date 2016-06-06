import SourceMap from '../config/SourceMap';
import Messages from '../config/Messages';
import Handler from './Handler';
import leftPad from '../config/LeftPad';

declare global {
  interface IBuilder {
    Warnigns: typeof Messages.Warnings;
    Errors: typeof Messages.Errors;
    Infos: typeof Messages.Infos;

    sourceMap: SourceMap;
    handler: IHandler;
    text: string;

    addLine(): void;
    add(text: string, location?: AstLocation): void;
    join(array: IVisitor[], joinWith?: string, append?: string): void;
    pad(indent: number): void;

    // addError(location: AstLocation, error: Function, ...args: any[]): void;
    // addWarning(location: AstLocation, warning: Function, ...args: any[]): void;
  }
}

export default class Builder implements IBuilder {

  Warnigns = Messages.Warnings;
  Errors = Messages.Errors;
  Infos = Messages.Infos;

  sourceMap: SourceMap;
  handler: IHandler;

  text: string;

  private currentLine: number;
  private currentColumn: number;
  private lineText: string;

  // constructor

  constructor(handler?: IHandler) {
    this.handler = handler ? handler : new Handler();
    this.text = '';
    this.currentLine = 0;
    this.currentColumn = 0;
    this.lineText = '';

    // init source map, reset previous run
    this.sourceMap = new SourceMap();
    this.sourceMap.init();
  }

  // methods

  addLine() {
    this.add('\n');
  }

  add(text: string, location?: AstLocation) {
    // add to current text
    this.text += text;
    // count how many new line characters are there
    let nls = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '\n') { nls++ };
    }

    if (location) {
      // console.log(node)
      this.sourceMap.setLine(
        this.currentLine,
        this.currentColumn,
        location.line,
        location.column);
    }

    // we start a new column if it was detected
    // if it was a last column we add what is remaming after the '\n' symbol
    this.currentColumn = nls === 0 ?
      this.currentColumn + text.length : // same line
      text.substring(text.lastIndexOf('\n')).length; // new line
    this.currentLine += nls;
  }

  join(array: IVisitor[], joinWith = ', ', append = '') {
    if (array && array.length) {
      for (let i = 0; i < array.length; i++) {
        array[i].visit(this, array[i].node);

        // add separator
        if (i < array.length - 1) {
          this.add(joinWith);
        }
      }
      if (append) {
        this.add(append);
      }
    }
  }

  pad(indent: number): void {
    this.add(leftPad('', indent));
  }

  // static addInfo(message: string, location: AstLocation) {
  //   this.handler.addInfo(message, location);
  // }

  // addError(location: AstLocation, error: Function, ...args: any[]) {
  //   this.handler.addError(error.apply(null, args), location.line, location.column);
  // }
  //
  // addWarning(location: AstLocation, warning: Function, ...args: any[]) {
  //   this.handler.addWarning(warning.apply(null, args), location.line, location.column);
  // }

  // static methods


  // static build(cu: CompilationUnit, sourceMapIn?: SourceMap, handlerIn?: Handler) {
  //   // this.sourceMap = sourceMapIn ? sourceMapIn : new SourceMap();
  //   // this.handler = handlerIn ? handlerIn : new Handler();
  //   // this.text = '';
  //   // this.currentLine = 0;
  //   // this.currentColumn = 0;
  //   // this.lineText = '';
  //   //
  //   // // init source map, reset previous run
  //   // this.sourceMap.init();
  //   //
  //   // new CompilationUnitVisitor().visit(cu);
  //
  //   // builder contains all the needed text
  //   return this.text;
  // }
}
