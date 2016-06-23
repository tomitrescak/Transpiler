import React from "react";
import ReactDOM from "react-dom";

import TabbedTextEditor from "../../text_editor/containers/tabbed_text_editor_container";
import BoardEditor from "../../board/components/board_editor_view";

//////////////////////////////////////////////////////////////////////////////
// ExercisesView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  solution: ISolution;
  markingMode: boolean;
  background: string;
  context: () => IContext;
}

export default class ExerciseView extends React.Component<IComponentProps, {}> {

  boardViewModel: IBoardView;
  context: IContext;
  textEditor: ITabbedEditorManager;
  compilationListener: ICompilationListener;

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  assignBoard(boardView: IBoardView) {
    this.boardViewModel = boardView;
  }

  assignEditor(textEditor: ITabbedEditorManager) {
    this.textEditor = textEditor;

    // this is needed when in marking we select a new solution
    if (this.compilationListener) {
      this.textEditor.addListener(this.compilationListener);
    }
  }

  assignListener(listener: ICompilationListener) {
    this.compilationListener = listener;
    this.textEditor.addListener(listener)
  }

  resizeRightTwoPanels() {
    const self = this;
    const hresize = this.context.Utils.Ui.relativeResize(
      $(ReactDOM.findDOMNode(this.refs["exerciseEditor"])),
      $(ReactDOM.findDOMNode(this.refs["exerciseInfo"])),
      $(ReactDOM.findDOMNode(this.refs["h50"])),
      self.boardViewModel);

    window.addEventListener("mousemove", hresize, true);
    window.addEventListener("mouseup", function() {
      window.removeEventListener("mousemove", hresize, true);
    }, true);
    return false;
  }

  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  render() {
    let self = this;
    this.context = this.props.context();

    return (
      <span>
        <div className="resizer h50" onMouseDown={this.resizeRightTwoPanels.bind(this) } ref="h50" />
        <div id="exerciseEditor" ref="exerciseEditor">
          <TabbedTextEditor
            context={this.props.context}
            canModify={false}
            allowEditLibraries={false}
            onModelInit={this.assignEditor.bind(this)}
            hideLibraries={true}
            background="blackBackground"
            files={this.props.markingMode && this.props.solution.status === "Submitted" && this.props.solution.submission ? this.props.solution.submission.files : this.props.solution.files}
            uniqueName={this.props.solution._id + this.props.solution.schedule._id + this.props.solution.practical._id + this.props.solution.exercise._id} />
        </div>
        <div id="exerciseInfo" ref="exerciseInfo">
          <div id="infoContent">
            <BoardEditor
              schedule={this.props.solution.schedule}
              practical={this.props.solution.practical}
              exercise={this.props.solution.exercise}
              solution={this.props.solution}
              addListener={(listener: ICompilationListener) => self.assignListener(listener) }
              boardViewCreated={this.assignBoard.bind(this) }
              context={this.props.context}
              showBackButton={true} />
          </div>
        </div>
      </span>
    );
  }
}
