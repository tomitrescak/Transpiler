import React from "react";

import TabControl from "../../tabs/containers/tab_control_container";
import BoardView from "../../board/components/board_view";
import BoardValidationsView from "./admin_board_validations_view";
import Board from "../../../models/board_model"; // TODO: Remove

import Universe from "../../../models/universe_model";
import { UiUtils } from "../../../utils/helpers_client";
import binding from "../../../utils/binding";

//////////////////////////////////////////////////////////////////////////////
// AdminBoardView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IAdminBoardViewProps {
  board?: IBoard;
  boardIndex: number;
  deleteBoard: (board: IBoard) => void;
  key: number;
}


class AdminBoardView extends React.Component<IAdminBoardViewProps, {}> {
  boardView: IBoardView;

  constructor(props: IAdminBoardViewProps) {
    super();
    // this.state = {
    //   bar: props.foo
    // }
  }

  boardId(): string {
    return "Board-" + this.props.boardIndex;
  }

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  assignBoardView(boardView: IBoardView) {
    this.boardView = boardView;
  }

  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  render() {
    return (
      <div>
        <div className="five fields">
          <div className="field">
            <label>{ mf("rows") }</label>
            <input className="rows" type="number" placeholder={ mf("rows") }
              defaultValue={ this.props.board.rows.toString() } onChange={binding.bind(this, "board.rows") } />
          </div>
          <div className="field">
            <label>{ mf("columns") }</label>
            <input className="columns" type="number" placeholder={ mf("columns") }
              defaultValue={ this.props.board.columns.toString() } onChange={binding.bind(this, "board.columns") } />
          </div>
          <div className="field">
            <label>{ mf("oneStar") }</label>
            <input className="stepsOneStar" type="number" placeholder={ mf("steps") }
              defaultValue={ this.props.board.stars.oneStar.toString() } onChange={binding.bind(this, "board.stars.oneStar") } />
          </div>
          <div className="field">
            <label>{ mf("twoStars") }</label>
            <input className="stepsTwoStars" type="number" placeholder={ mf("steps") }
              defaultValue={ this.props.board.stars.twoStars.toString() } onChange={binding.bind(this, "board.stars.twoStars") } />
          </div>
          <div className="field">
            <label>&nbsp; </label>
            <div className="ui toggle checkbox wrapBoard" style={{ marginTop: 3 }}>
              <input type="checkbox" defaultChecked={ this.props.board.wrap } className="wrap"
                onChange={binding.bind(this, "board.wrap", "checked") } />
              <label>{ mf("wrap") }</label>
            </div>
          </div>
        </div>

        <BoardView board={this.props.board}
          editorId={this.boardId() }
          editorState={null}
          resizeVertically={false}
          boardViewCreated={this.assignBoardView.bind(this) } />

        <BoardValidationsView board={this.props.board} boardIndex={this.props.boardIndex} validations={this.props.board.validations} />

        <div className="ui right floated red icon labeled button deleteBoard" style={{ marginTop: 12 }}
          onClick={this.props.deleteBoard.bind(this, this.props.board) }>
          <i className="trash icon" /> { mf("delete.board") }
        </div>

        <div style={{ clear: "both" }} />
      </div>
    )
  }
}

//////////////////////////////////////////////////////////////////////////////
// AdminBoardView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IAdminBoardsViewProps {
  exercise: IExercise;
  boards?: IBoard[];
}

interface IAdminBoardsViewState {
  tabs?: ITab[],
  selectedTabIndex?: number;
}

export default class AdminBoardsView extends React.Component<IAdminBoardsViewProps, IAdminBoardsViewState> {
  constructor(props: IAdminBoardsViewProps) {
    super();

    this.state = {
      tabs: this.createTabs(props),
      selectedTabIndex: 0
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // HELPERS                                                                  //
  //////////////////////////////////////////////////////////////////////////////

  createTabs(props: IAdminBoardsViewProps) {
    let tabs: ITab[] = [];

    for (let i = 0; i < props.boards.length; i++) {
      let board = props.boards[i];

      tabs.push({
        name: "World" + i,
        label: mf("worldNum") + (i + 1),
        content: (
          <AdminBoardView key={i} board={board} boardIndex={i} deleteBoard={this.deleteBoard.bind(this, board) } />
        )
      });
    }

    return tabs;
  }

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  addBoard() {
    if (this.props.exercise.worldId) {
      let board = new Board();
      board.world = Universe.getWorld(this.props.exercise.worldId);
      this.props.boards.push(board);
      this.setState({ tabs: this.createTabs(this.props), selectedTabIndex: this.props.boards.length - 1 });
    } else {
      UiUtils.alertDialog("error.missingWorldId", "error");
    }
  }

  deleteBoard(board: IBoard) {

    UiUtils.confirmDialog("confirm.delete", () => {
      this.props.boards.splice(this.props.boards.indexOf(board), 1);
      this.setState({ tabs: this.createTabs(this.props), selectedTabIndex: 0 });

      UiUtils.deletedDialog();
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  render() {
    return (
      <div>
        <TabControl add={this.addBoard.bind(this) } tabs={this.state.tabs} />
      </div>
    )
  }

  // componentWillMount() {
  //   this.createTabs();
  // }
  //
  // componentDidUpdate() {
  //   this.createTabs();
  // }
}
