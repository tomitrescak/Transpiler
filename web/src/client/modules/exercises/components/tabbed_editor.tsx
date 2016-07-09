import * as React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import StatusBar  from '../containers/tabbed_editor_status_container';
import jss from '../../../configs/jss';
import { Tabs, Tab } from 'semanticui-react';
import { CenteredLoading } from '../../core/components/loading_view';

import 'brace/mode/java';
import 'brace/theme/ambiance';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';

const css = jss({
  container: {
    '& .ace_editor': {
      position: 'absolute!important',
      top: 0,
      bottom: '60px',
      left: 0,
      right: 0
    }
  }
});


export interface IComponentProps {
  files: ITextFileDAO[];
  id: string;
}

export interface IComponentActions {
  initCompiler: () => void;
  compile: () => void;
}

interface IComponent extends IComponentProps, IComponentActions { };

let file: ITextFileDAO;
let index: number;

export default class App extends React.Component<IComponent, {}> {
  text: HTMLTextAreaElement;
  editors: any[] = [];

  onChange(editorFile: ITextFileDAO, newValue: string) {
    // change the file source: Maybe Dispatch this change ?
    const modifiedFile = this.props.files.find((f) => f.name === editorFile.name);
    modifiedFile.source = newValue;
    this.props.compile();
  }

  loadEditor(editorFile: ITextFileDAO, editor: any) {
    this.editors.push({ file: editorFile.name, ace: editor });
    // this.editors[editorFile.name] = { file: editorFile, error: false, compilationRequest: false, ace: editor };
  }

  render() {
    if (!global['java2js']) {
      console.log('Waiting ...');
      setTimeout(() => this.forceUpdate(), 100);
      return <CenteredLoading text="loading.compiler" />;
    }
    return (
      <span className={css.container}>
        <Tabs id={'tabs_' + this.props.id}>
          <For each="file" index="index" of={this.props.files}>
            <Tab key={index} name={file.name} title={file.name} style={{ height: '100%', padding: '0px', border: '1px solid #444' }}>
              <AceEditor
                width="inherit"
                height="inherit"
                style={{}}
                mode="java"
                theme="ambiance"
                onChange={this.onChange.bind(this, file) }
                name={this.props.id + file.name}
                editorProps={{ $blockScrolling: true }}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                highlightActiveLine={true}
                showGutter={true}
                value={file.source}
                onLoad={this.loadEditor.bind(this, file) }
                />
            </Tab>
          </For>
        </Tabs>
        <StatusBar editors={this.editors} sessionId={this.props.id} />
      </span>
    );
  }

  shouldComponentUpdate(currentProps: IComponentProps, nextProps: IComponentProps) {
    return false;
  }

  init() {
    this.props.initCompiler();
    this.props.compile();
  }

  componentDidMount() {
    if (global['java2js']) {
      this.init();
    }
  }

  componentDidUpdate() {
    this.init();
  }
}
