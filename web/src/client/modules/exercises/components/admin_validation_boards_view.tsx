import React from "react";
import TabControl from "../../tabs/containers/tab_control_container";
import BoardView from "../../board/components/board_view";

import { UiUtils } from "../../../utils/helpers_client";

//////////////////////////////////////////////////////////////////////////////
// ValidationBoardView Component                                            //
//////////////////////////////////////////////////////////////////////////////

interface IValidationBoardViewProps {
  key: number;
  board?: IBoard;
  boardIndex: string;
  deleteBoard: any;
}

interface IValidationBoardViewState {
  bar: string;
}

class ValidationBoardView extends React.Component<IValidationBoardViewProps, IValidationBoardViewState> {
  constructor(props: IValidationBoardViewProps) {
    super();
    // this.state = {
    //   //bar: props.foo
    // }
  }

  render() {
    return (
      <div>

        <BoardView board={this.props.board}
          editorId={this.props.boardIndex}
          editorState={null}
          resizeVertically={false}
          />

        <div className="ui right floated red icon labeled button" onClick={this.props.deleteBoard}>
          <i className="trash icon" /> { mf("validation.boardDelete") }
        </div>
        <div style={{ clear: "both" }} />
      </div>
    );
  }
}

//////////////////////////////////////////////////////////////////////////////
// BoardValidationsView Component                                           //
//////////////////////////////////////////////////////////////////////////////

interface IValidationBoardsViewProps {
  board: IBoard;
  validation: IBoardValidation;
  boardIndex: string;
}

interface IValidationBoardsViewState {
  tabs?: ITab[];
  selectedTabIndex?: number;
}

export default class ValidationBoardsView extends React.Component<IValidationBoardsViewProps, IValidationBoardsViewState> {
  constructor(props: IValidationBoardsViewProps) {
    super();
    this.state = {
      tabs: this.createTabs(props),
      selectedTabIndex: 0
    };
  }

  //////////////////////////////////////////////////////////////////////////////
  // HELPERS                                                                  //
  //////////////////////////////////////////////////////////////////////////////

  createTabs(props: IValidationBoardsViewProps) {
    let tabs: ITab[] = [];

    for (let i = 0; i < props.validation.boards.length; i++) {
      let board = props.validation.boards[i];

      tabs.push({
        name: "Board-" + props.boardIndex + "-" + i,
        label: mf("board.number") + (i + 1),
        content: (
          <ValidationBoardView
            key={i}
            board={board}
            boardIndex={props.boardIndex + "-" + i}
            deleteBoard={this.deleteBoard.bind(this, board) } />
        )
      });
    }
    return tabs;
  }

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  addBoard() {
    this.props.validation.addBoard(this.props.board);
    this.setState({ tabs: this.createTabs(this.props), selectedTabIndex: this.props.validation.boards.length - 1 });
  }

  deleteBoard(board: IBoard) {
    UiUtils.confirmDialog("confirm.delete", () => {
      this.props.validation.boards.splice(this.props.validation.boards.indexOf(board), 1);
      this.setState({ tabs: this.createTabs(this.props), selectedTabIndex: 0 });

      UiUtils.deletedDialog();
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  render() {
    return (
      <TabControl
        tabs={this.state.tabs}
        add={this.addBoard.bind(this) }
        level="level3"
        background="whiteBackground" />
    );
  }
}
