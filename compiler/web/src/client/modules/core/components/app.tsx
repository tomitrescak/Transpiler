import * as React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import { Button, Tabs, Tab } from 'semanticui-react';

import 'brace/mode/java';
import 'brace/theme/ambiance';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';

interface IState {
  ts?: string;
  js?: string;
}

let value: string;

export default class App extends React.Component<{}, {}> {
  text: HTMLTextAreaElement;
  editor: any;

  onChange(newValue: string) {
    value = newValue;
    let result = java2js.compile({ name: 'File.java', source: value });
    console.log(result)

    if (result.errors.length) {
      let annotations = result.errors.map((e: any) => ({
        row: e.line,
        column: 0,
        text: e.message,
        type: 'error'
      }));
      console.log(annotations);
      setTimeout(() => { this.editor.session.setAnnotations(annotations) }, 100);
    } else {
      this.editor.session.clearAnnotations();
    }
  }

  loadEditor(editor: any) {
    this.editor = editor;
    editor.session.setAnnotations([{row:1 ,column: 0, text: "message", type:"error"}]);
  }

  render() {
    return (
      <div>
        <Button text="tomi" />
        <table style={{ width: '100%' }} cellPadding={10}>
          <tbody><tr>
            <td style={{ width: '40%', verticalAlign: 'top' }}>
              <Tabs id="main">
                <Tab name="first" title="First">
                  <AceEditor
                    mode="java"
                    theme="ambiance"
                    onChange={this.onChange.bind(this) }
                    name="first_editor"
                    editorProps={{ $blockScrolling: true }}
                    enableBasicAutocompletion={true}
                    enableLiveAutocompletion={true}
                    highlightActiveLine={true}
                    showGutter={true}
                    onLoad={this.loadEditor.bind(this)}
                    />
                </Tab>
                <Tab name="second" title="Second">
                  <AceEditor
                    mode="java"
                    theme="ambiance"
                    onChange={this.onChange.bind(this) }
                    name="secons_editor"
                    editorProps={{ $blockScrolling: true }}
                    enableBasicAutocompletion={true}
                    enableLiveAutocompletion={true}
                    highlightActiveLine={true}
                    showGutter={true}
                    onLoad={this.loadEditor.bind(this)}
                    value={`ew erw
                      rw
                      er
                      wr
                      w
                      r
                      wer
                      wer
                      w
                      ew
                      er`}
                    />
                </Tab>
              </Tabs>

            </td>
            <td style={{ width: '30%', verticalAlign: 'top' }}>
              <pre id="ts"></pre>
            </td>
            <td style={{ width: '30%', verticalAlign: 'top' }}>
              <pre id="js"></pre>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    java2js.initService([]);
  }
}

// <textarea id="source" style={{ width: '100%', height: 200 }} ref={(node) => this.text = node}></textarea>
