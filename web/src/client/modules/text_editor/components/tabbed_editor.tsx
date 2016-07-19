import * as React from 'react';
import StatusBar from '../containers/tabbed_editor_status_container';
import jss from '../../../configs/jss';
import { Tabs, Tab, Button, Buttons, DropdownButton, Menu, MenuItem, Divider } from 'semanticui-react';
import { CenteredLoading } from '../../core/components/loading_view';

import swal from 'sweetalert2';

import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/java';
import 'brace/theme/ambiance';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';

const css = jss({
  container: {
    '& .ace_editor': {
      position: 'absolute!important',
      top: 0,
      bottom: '19px',
      left: 0,
      right: 0
    },
    '& .menu .item': {
      height: '30px',
      'margin': '10px 3px 0px 3px'
    },
    '& .item': {
      color: 'white!important',
      cursor: 'pointer',
      '&.active': {
        color: 'black!important',
      }
    },
    '& .tab.segment': {
      position: 'absolute!important',
      left: '0px',
      top: '40px',
      margin: '0px!important',
      'border-radius': '0px',
      border: '0px'
    }
  },
  toolButtons: {
    position: 'absolute!important',
    right: '0px',
    top: '4px',
    //width: '100px';
    //border: '1px solid #444'
  }
});


export interface IProps {
  id: string;
  files: ITextFileDAO[];
  fileActions: IFileEditorActions;
  classes?: string;
  showAdminControls: boolean;
}


export interface IComponentProps {
  showAllFiles: boolean;
  context: IContext;
}

export interface IComponentActions {
  initCompiler: () => void;
  compile: () => void;
  toggleShowAllFiles: (show: boolean) => void;
}

interface IComponent extends IComponentProps, IComponentActions, IProps { };

let file: ITextFileDAO;
let index: number;
const icons = {
  library: 'book',
  userCode: 'code',
  interface: 'cube'
}

export default class TabbedEditor extends React.Component<IComponent, {}> {
  text: HTMLTextAreaElement;
  editors: any[] = [];
  compilerIntialised: boolean;

  onChange(editorFile: ITextFileDAO, newValue: string) {
    // change the file source and immediatelly compile
    this.props.fileActions.changeSource(editorFile.name, newValue, this.props.compile);
  }

  loadEditor(editorFile: ITextFileDAO, editor: any) {
    this.editors.push({ file: editorFile.name, ace: editor });
    // this.editors[editorFile.name] = { file: editorFile, error: false, compilationRequest: false, ace: editor };
  }

  render() {
    // wait till java2js is loaded
    if (!global['java2js']) {
      console.log('Waiting ...');
      setTimeout(() => this.forceUpdate(), 100);
      return <CenteredLoading text="loading.compiler" />;
    }

    const files = this.props.fileActions.getFiles(this.props.showAllFiles);
    const { context } = this.props;
    let selectedFile: string = this.props.files && this.props.files.length ? this.props.files[0].name : '';

    // filer files

    return (
      <span className={this.props.classes}>
        <div className={css.toolButtons}>
          <If condition={this.props.showAdminControls}>
            <Buttons>
              <Button compact icon="angle left" onClick={() => this.props.fileActions.moveLeft(selectedFile)} />
              <Button compact icon="angle right" onClick={() => this.props.fileActions.moveRight(selectedFile)} />
            </Buttons>
            <Button color="red" compact icon="trash" onClick={() => context.Utils.Ui.confirmDialog(() => this.props.fileActions.removeFile(selectedFile), selectedFile)} style={{ marginLeft: '6px' }} />
          </If>
          <DropdownButton color="orange" compact icon="wrench" activation="click" id="editorOptions" pointing="top right">
            <Menu>
              <If condition={this.props.showAdminControls}>
                <MenuItem text="addLibrary" icon="plus"
                  onClick={() => context.Utils.Ui.promptText((fileName: string) => this.props.fileActions.addFile(fileName, 'library'), 'promptAddLibrary')} />
                <MenuItem text="addCode" icon="plus"
                  onClick={() => context.Utils.Ui.promptText((fileName: string) => this.props.fileActions.addFile(fileName, 'userCode'), 'promptAddCode')} />
                <MenuItem text="addInterface" icon="plus"
                  onClick={() => context.Utils.Ui.promptText((fileName: string) => this.props.fileActions.addFile(fileName, 'interface'), 'promptAddDefinition')} />
                <MenuItem text="renameFile" icon="bubble"
                  onClick={() => context.Utils.Ui.promptText((fileName: string) => this.props.fileActions.changeName(selectedFile, fileName), 'promptRenameCode', selectedFile)} />
                <MenuItem text="changeType" icon="bubble"
                  onClick={() => context.Utils.Ui.promptOptions((fileType: string) => this.props.fileActions.changeType(selectedFile, fileType), 'promptRenameCode', 'Select Type', { 'library': 'Library', 'userCode': 'User Code' })} />
                <Divider />
              </If>
              <MenuItem text="showAllFiles" onClick={() => this.props.toggleShowAllFiles(!this.props.showAllFiles)} />
            </Menu>
          </DropdownButton>
        </div>
        <span className={css.container}>
          <Tabs id={'tabs_' + this.props.id} selected={(tabFile) => selectedFile = tabFile}>
            <For each="file" index="index" of={files}>
              <Tab key={index} name={file.name} title={file.name} icon={icons[file.type]}>
                <AceEditor
                  width="inherit"
                  height="inherit"
                  style={{}}
                  mode="java"
                  theme="ambiance"
                  readOnly={file.readonly}
                  onChange={this.onChange.bind(this, file)}
                  name={this.props.id + file.name}
                  editorProps={{ $blockScrolling: true }}
                  enableBasicAutocompletion={true}
                  enableLiveAutocompletion={true}
                  highlightActiveLine={true}
                  showGutter={true}
                  value={file.source}
                  onLoad={this.loadEditor.bind(this, file)}
                  />
              </Tab>
            </For>
          </Tabs>
        </span>
        <StatusBar editors={this.editors} sessionId={this.props.id} />
      </span>
    );
  }

  // shouldComponentUpdate(nextProps: IComponent) {
  //   return this.props.files !== nextProps.files || this.props.showAllFiles !== nextProps.showAllFiles;
  // }

  init() {
    console.log('Initialising compiler ...');
    this.compilerIntialised = true;
    this.props.initCompiler();
    this.props.compile();
  }

  componentDidMount() {
    if (global['java2js']) {
      this.init();
    }
  }

  componentDidUpdate(prevProps: IComponent) {
    if (global['java2js']) {
      if (this.props.id !== prevProps.id || !this.compilerIntialised) {
        this.init();
      }
    }
  }
}
