"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var react_ace_1 = require('react-ace');
var semanticui_react_1 = require('semanticui-react');
require('brace/mode/java');
require('brace/theme/ambiance');
require('brace/ext/searchbox');
require('brace/ext/language_tools');
var value;
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.onChange = function (newValue) {
        var _this = this;
        value = newValue;
        var result = java2js.compile({ name: 'File.java', source: value });
        console.log(result);
        if (result.errors.length) {
            var annotations_1 = result.errors.map(function (e) { return ({
                row: e.line,
                column: 0,
                text: e.message,
                type: 'error'
            }); });
            console.log(annotations_1);
            setTimeout(function () { _this.editor.session.setAnnotations(annotations_1); }, 100);
        }
        else {
            this.editor.session.clearAnnotations();
        }
    };
    App.prototype.loadEditor = function (editor) {
        this.editor = editor;
        editor.session.setAnnotations([{ row: 1, column: 0, text: "message", type: "error" }]);
    };
    App.prototype.render = function () {
        return (React.createElement("div", null, 
            React.createElement(semanticui_react_1.Button, {text: "tomi"}), 
            React.createElement("table", {style: { width: '100%' }, cellPadding: 10}, 
                React.createElement("tbody", null, 
                    React.createElement("tr", null, 
                        React.createElement("td", {style: { width: '40%', verticalAlign: 'top' }}, 
                            React.createElement(semanticui_react_1.Tabs, {id: "main"}, 
                                React.createElement(semanticui_react_1.Tab, {name: "first", title: "First"}, 
                                    React.createElement(react_ace_1.default, {mode: "java", theme: "ambiance", onChange: this.onChange.bind(this), name: "first_editor", editorProps: { $blockScrolling: true }, enableBasicAutocompletion: true, enableLiveAutocompletion: true, highlightActiveLine: true, showGutter: true, onLoad: this.loadEditor.bind(this)})
                                ), 
                                React.createElement(semanticui_react_1.Tab, {name: "second", title: "Second"}, 
                                    React.createElement(react_ace_1.default, {mode: "java", theme: "ambiance", onChange: this.onChange.bind(this), name: "secons_editor", editorProps: { $blockScrolling: true }, enableBasicAutocompletion: true, enableLiveAutocompletion: true, highlightActiveLine: true, showGutter: true, onLoad: this.loadEditor.bind(this), value: "ew erw\n                      rw\n                      er\n                      wr\n                      w\n                      r\n                      wer\n                      wer\n                      w\n                      ew\n                      er"})
                                ))
                        ), 
                        React.createElement("td", {style: { width: '30%', verticalAlign: 'top' }}, 
                            React.createElement("pre", {id: "ts"})
                        ), 
                        React.createElement("td", {style: { width: '30%', verticalAlign: 'top' }}, 
                            React.createElement("pre", {id: "js"})
                        ))
                )
            )));
    };
    App.prototype.shouldComponentUpdate = function () {
        return false;
    };
    App.prototype.componentDidMount = function () {
        java2js.initService([]);
    };
    return App;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
// <textarea id="source" style={{ width: '100%', height: 200 }} ref={(node) => this.text = node}></textarea>
