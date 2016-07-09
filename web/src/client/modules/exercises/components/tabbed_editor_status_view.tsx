import * as React from 'react';
import jss from '../../../configs/jss';

const css = jss({
  container: {
    position: 'absolute',
    background: '#333',
    left: '0px',
    bottom: '0px',
    width: '100%',
    color: '#ddd',
    padding: '0px 3px',
    height: '20px',
    'z-index': 1000,
    overflow: 'hidden',
    border: '1px solid #666',
    'font-size': '11px'
  }
});

export interface IComponentProps {
  session: ICompilerSession;
}

interface IProps extends IComponentProps {
  editors: any[];
}

export default class EditorStatus extends React.Component<IProps, {}> {
  errorView() {
    let errs = 0;
    let first_error: ICompilerError;
    for (let err in this.props.session.errors) {
      let derr = this.props.session.errors[err];
      errs += derr ? derr.length : 0;
      if (!first_error) {
        first_error = derr[0];
        first_error['file'] = err;
      }
    }
    if (!first_error) {
      return '';
    }

    return `s (${errs}): ${first_error.text.substring(0, 30)} ... at line ${first_error.row} in "${first_error['file']}"`;
  }

  render() {
    return (
      <div className={css.container}>
        <Choose>
          <When condition={this.props.session}>
            <span>
              { this.props.session.state }{ this.props.session.errors ? this.errorView() : '' }
            </span>
          </When>
          <Otherwise>...</Otherwise>
        </Choose>
      </div>
    );
  }

  componentDidUpdate() {
    for (let editor of this.props.editors) {
      let errs = this.props.session.errors[editor.file];
      if (errs) {
        editor.ace.session.setAnnotations(errs);
      } else {
        editor.ace.session.clearAnnotations();
      }
    }

  }
}
