import * as React from "react";
import EventObject from 'eventobject';
import jss from '../../../configs/jss';
// import TabbedTextEditor from "../../text_editor/containers/tabbed_text_editor_container";
// import BoardEditor from "../../board/components/board_editor_view";
import TabbedEditor from '../containers/tabbed_editor_container';


const css = jss({
  editor: {
    position: 'absolute',
    display: 'table-cell',
    width: '50%',
    height: '100%',
    'margin-right': '3px',
    '& .item': {
      color: 'white!important',
      cursor: 'pointer',
      '&.active': {
        color: 'black!important',
      }
    }
  },
  info: {
    position: 'absolute',
    display: 'table-cell',
    width: '50%',
    height: '100%',
    right: '0px',
    'margin-left': '3px'
  },
  // #infoContent {
  //   position: absolute,
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  // }
  resizer: {
    position: 'absolute',
    width: '8px',
    height: '40px',
    'background-color': 'darkgray',
    'z-index': '10',
    cursor: 'ew-resize',
    'border-radius': '3px',
    'border': 'solid 1px #333',
    'top': '40px',
    'margin-left': '-4px',
    '&.h50': {
      left: '50%'
    }
  }
});


export interface IComponentProps {
  solution: ISolutionDAO;
  markingMode: boolean;
  background: string;
  context: IContext;
}

export interface IComponentActions {
}

export const ExerciseView = ({ context, solution }: IComponentProps) => {
  let left: HTMLElement;
  let right: HTMLElement;
  let resizeHandle: HTMLElement;
  let evt = new EventObject();
  return (
    <span>
      <div ref={(node) => resizeHandle = node} className={css.resizer + ' h50'} onMouseDown={() => context.Utils.Ui.resizer(left, right, resizeHandle, evt) } />
      <div ref={(node) => left = node} className={css.editor}>
        <TabbedEditor id={solution._id}
          files={
            [
              { name: 'File1.java', source: 'class B extends A {}', type: 'User' }
            ]}
          libraries={
            [
              { name: 'File2.java', source: 'class A {}', type: 'User' }
            ]} />
        {/*<TabbedTextEditor
            context={context}
            canModify={false}
            allowEditLibraries={false}
            onModelInit={assignEditor.bind(this)}
            hideLibraries={true}
            background="blackBackground"
            files={markingMode && solution.status === "Submitted" && solution.submission ? solution.submission.files : solution.files}
            uniqueName={solution._id + solution.schedule._id + solution.practical._id + solution.exercise._id} />*/}
      </div>
      <div  ref={(node) => right = node}  className={css.info}>
        <div id="infoContent">
          {/*<BoardEditor
              schedule={solution.schedule}
              practical={solution.practical}
              exercise={solution.exercise}
              solution={solution}
              addListener={(listener: ICompilationListener) => self.assignListener(listener) }
              boardViewCreated={assignBoard.bind(this) }
              context={context}
              showBackButton={true} />*/}
        </div>
      </div>
    </span>
  );
}

export default ExerciseView;
