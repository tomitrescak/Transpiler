// declare interface IRouterUtils {
//   encodeUrlName(name: string): string;
//   pathFor(routeName: string, routeParams?: Object, qsParams?: Object): string;
//   go(routeName: string, routeParams?: Object, qsParams?: Object): void;
//   getParam(paramName: string): string;
// }
//
// declare interface IUiUtils {
//   alert(text: string, params?: Object): void;
//   alertDialog(title: string, text: string, type?: string): void;
//   announce(infoText: string, errorText: string, callback?: Meteor.AsyncCallback): Meteor.AsyncCallback;
//   announceCreated(callback?: Meteor.AsyncCallback): Meteor.AsyncCallback;
//   announceSaved(callback?: Meteor.AsyncCallback): Meteor.AsyncCallback;
//   announceDeleted(callback?: Meteor.AsyncCallback): Meteor.AsyncCallback;
//   announceDuplicated(callback?: Meteor.AsyncCallback): Meteor.AsyncCallback;
//   confirmDialog(text: string, callback: Function, title?: string,
//     confirmButtonText?: string, type?: string, closeOnConfirm?: boolean): void;
//   deletedDialog(): void;
//   datePicker(elem: Element, context: any, field: string): void;
//   hResize(lDiv: JQuery, rDiv: JQuery, marker: JQuery): void;
//   relativeResize(lDiv: JQuery, rDiv: JQuery, marker: JQuery, boardModel: IBoardView): any;
//   niceDate(date: Date): string;
//   fullDate(date: Date): string;
//   pageTransition(): void;
//   previewMarkdown(text: string, length: number): string;
//   relativeDate(date: Date): string;
//   removeSaveListener(): void;
//   registerSaveListener(obj: ISaveable, saveFunction?: Function): void;
//   showMarkdownModal(raw: string, header?: string): void;
//   parseText(text: string): string;
// }
//
// /////////////////////////////////////////
// // SYSTEM UTILS                        //
// /////////////////////////////////////////
//
// declare interface IClassUtils {
//   indexArray(arr: any[]): any[];
// }
