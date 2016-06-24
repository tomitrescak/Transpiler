import React from "react";
import TabControl from "../../tabs/containers/tab_control_container";
import { UiUtils } from "../../../utils/helpers_client";
import ValidationBoardsView from "./admin_validation_boards_view";

import binding from "../../../utils/binding";
//import TabModel, { } from "../../tabs/components/tabs_model";
import BoardValidation from "../../../models/board_validation_model";

interface IBoardValidationViewProps {
  key: number;
  board: IBoard;
  validation?: IBoardValidation;
  boardIndex: string;
  deleteValidation: any;
}

interface IBoardValidationViewState {
  inputs?: string[];
  outputs?: string[];
}

class BoardValidationView extends React.Component<IBoardValidationViewProps, IBoardValidationViewState> {

  constructor(props: IBoardValidationViewProps) {
    super();
    this.state = {
      inputs: props.validation.input,
      outputs: props.validation.output
    };
  }

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  addInput() {
    this.state.inputs.push("");
    this.setState({ inputs: this.state.inputs });
  }

  addOutput() {
    this.state.outputs.push("");
    this.setState({ outputs: this.state.outputs });
  }

  removeInput(index: number) {
    this.state.inputs.splice(index, 1);
    this.setState({ inputs: this.state.inputs });
  }

  removeOutput(index: number) {
    this.state.outputs.splice(index, 1);
    this.setState({ outputs: this.state.outputs });
  }



  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  render() {
    let input: string;
    let output: string;
    let index: number;

    return (
      <div>
        <div className="two fields validation">
          <div className="field">
            <label>{ mf("board.validationInputs") }</label>
            <For each="input" index="index" of={this.state.inputs}>
              <div className="ui action input">
                <input type="text" className="validationInput" placeholder={ mf("board.validationInout") }
                  defaultValue={ input } onChange={binding.bind(this, "validation.input", "string", index) } />
                <div className="ui red right icon button" onClick={this.removeInput.bind(this, index) }>
                  <i className="trash icon" />
                </div>
              </div>
            </For>

            <div className="ui primary icon labeled fluid button" onClick={this.addInput.bind(this) }>
              <i className="plus icon" /> { mf("board.addInput") }
            </div>
          </div>
          <div className="field">
            <label>{ mf("board.validationOutputs") }</label>
            <For each="input" index="index" of={this.state.outputs}>
              <div key={index} className="ui action input">
                <input type="text" className="validationInput" placeholder={ mf("board.validationOutput") }
                  defaultValue={ output } onChange={binding.bind(this, "validation.output", "string", index) } />
                <div className="ui red right icon button" onClick={this.removeOutput.bind(this, index) }>
                  <i className="trash icon" />
                </div>
              </div>
            </For>
            <div className="ui primary icon labeled fluid button addOutput" onClick={this.addOutput.bind(this) }>
              <i className="plus icon" /> { mf("board.addOutput") }
            </div>
          </div>
        </div>

        <ValidationBoardsView board={this.props.board} validation={this.props.validation} boardIndex={this.props.boardIndex} />

        <div className="ui toggle checkbox" style={{ marginTop: 20 }}>
          <input type="checkbox" defaultChecked={ this.props.validation.checkPosition } className="checkPosition"
            onChange={binding.bind(this, "validation.checkPosition", "checked") } />
          <label>{ mf("board.validatePosition") }</label>
        </div>
        <div className="ui right floated red icon labeled button deleteValidation" style={{ marginTop: 10 }}
          onClick={this.props.deleteValidation}>
          <i className="trash icon" /> { mf("delete.validation") }
        </div>
        <div style={{ clear: "both" }} />
      </div>
    );
  }
}

//////////////////////////////////////////////////////////////////////////////
// BoardValidationsView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IBoardValidationsViewProps {
  boardIndex: number;
  board: IBoard;
  validations?: IBoardValidation[];
}

interface IBoardValidationsViewState {
  tabs?: ITab[];
  selectedTabIndex?: number;
}

export default class BoardValidationsView extends React.Component<IBoardValidationsViewProps, IBoardValidationsViewState> {

  constructor(props: IBoardValidationsViewProps) {
    super();
    this.state = {
      tabs: this.createTabs(props),
      selectedTabIndex: 0
    };
  }

  //////////////////////////////////////////////////////////////////////////////
  // HELPERS                                                                  //
  //////////////////////////////////////////////////////////////////////////////

  createTabs(props: IBoardValidationsViewProps) {
    let tabs: ITab[] = [];

    for (let i = 0; i < props.validations.length; i++) {

      tabs.push({
        name: "Validation-" + props.boardIndex + "-" + i,
        label: mf("board.validationNum") + (i + 1),
        content: (
          <BoardValidationView
            key={i}
            board={props.board}
            validation={props.validations[i]}
            boardIndex={props.boardIndex + "-" + i}
            deleteValidation={this.deleteValidation.bind(this, props.validations[i]) } />
        )
      });
    }

    return tabs;
  }

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  addValidation() {
    this.props.validations.push(new BoardValidation());
    this.setState({ tabs: this.createTabs(this.props), selectedTabIndex: this.props.validations.length - 1 });
  }

  deleteValidation(validation: IBoardValidation) {
    UiUtils.confirmDialog("confirm.delete", () => {
      this.props.validations.splice(this.props.validations.indexOf(validation), 1);
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
        add={this.addValidation.bind(this) }
        level="level2"
        background="whiteBackground">
      </TabControl>
    );
  }
}
