import React from "react";

import { DiffViewSimple, DiffView } from "meteor/tomi:diff";

import { getCodeHistory } from "../configs/method_stubs/history_methods";
import { UiUtils } from "../../../utils/helpers_client";

//////////////////////////////////////////////////////////////////////////////
// HistoryView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IHistoryViewProps {
  solutionId?: string;
  dueDate: Date;
  context: IContext;
}

interface IHistoryViewState {
  stepNumber?: number;
  history?: ICodeHistoryDAO[];
  loading?: boolean;
}

export default class HistoryView extends React.Component<IHistoryViewProps, IHistoryViewState> {
  constructor(props: IHistoryViewProps) {
    super();
    this.state = {
      loading: true,
      stepNumber: 0,
      history: []
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // HELPERS                                                                  //
  //////////////////////////////////////////////////////////////////////////////

  viewDelta() {
    if (this.state.history.length == 0) {
      return;
    }

    let currentStep = DiffViewSimple.renderDelta(this.state.history, this.state.stepNumber, 0);
    if (this.state.stepNumber > 0) {
      let previousStep = DiffViewSimple.renderDelta(this.state.history, this.state.stepNumber - 1, 0);
      let diff = DiffView.compare(previousStep, currentStep, "Previous", "Current", null, 0);
      $("#historyStepText").html(diff);
    } else {
      $("#historyStepText").html(currentStep);
    }
  };

  previewCode = function(code: string) {
    UiUtils.showMarkdownModal("```javascript\n" + code + "```");
  }

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  next(e: React.SyntheticEvent) {
    e.preventDefault();

    if (this.state.stepNumber == this.state.history.length - 1) {
      return;
    }

    this.setState({ stepNumber: ++this.state.stepNumber });
  }

  previous(e: React.SyntheticEvent) {
    e.preventDefault();

    if (this.state.stepNumber == 0) {
      return;
    }

    this.setState({ stepNumber: --this.state.stepNumber });
  }

  previewPrevious(e: React.SyntheticEvent) {
    if (this.state.stepNumber > 0) {
      this.previewCode(DiffViewSimple.renderDelta(this.state.history, this.state.stepNumber - 1, 0));
    }
  }

  previewCurrent(e: React.SyntheticEvent) {
    if (this.state.stepNumber > 0) {
      this.previewCode(DiffViewSimple.renderDelta(this.state.history, this.state.stepNumber, 0));
    }
  }

  setStep(e: React.SyntheticEvent) {
    let str = parseInt(e.currentTarget["value"]);
    if (str < 0) {
      str = 0;
    }
    if (str > this.state.history.length - 1) {
      str = this.state.history.length - 1;
    }
    if (!isNaN(str)) {
      this.setState({ stepNumber: str });
    }
  }

  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  labelColor(date: Date): string {
    return "ui label " + (date > this.props.dueDate ? "red" : "green");
  }

  render() {
    if (this.state.loading) {
      return <div>Loading ...</div>
    }
    if (this.state.history.length == 0) {
      return <div>No history</div>
    }

    const { Utils } = this.props.context;
    const currentDate = this.state.history[this.state.stepNumber].date;

    return (
      <div>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div className="ui icon labeled button" onClick={this.previous.bind(this) }>
            <i className="left arrow icon" />
            { mf("previous") }
          </div>
          <div className="ui input focus">
            <input type="text" style={{ width: 50 }} value={this.state.stepNumber.toString() } onChange={this.setStep.bind(this) } />
          </div>
          <div className="ui right labeled icon button" id="nextHistory" onClick={this.next.bind(this) }>
            <i className="right arrow icon" />
            { mf("next") }
          </div>
          <div style={{marginTop: 5, float: "right"}}>
            <span className={this.labelColor(currentDate)} id="timestamp">{ Utils.Ui.fullDate(currentDate)}</span>
          </div>
        </div>
        <pre id="historyStepText">  </pre>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div className="ui buttons" style={{ margin: 'auto' }}>
            <div className="ui button" onClick={this.previewPrevious.bind(this) }>
              { mf("previous") }
            </div>
            <div className="ui icon labeled primary button">
              <i className="icon search" />
              { mf("preview") }
            </div>
            <div className="ui button" onClick={this.previewCurrent.bind(this) }>
              { mf("current") }
            </div>
          </div>
        </div>
      </div>
    );
  }

  loadData() {
    if (!this.props.solutionId) {
      return;
    }
    getCodeHistory.call(this.props.solutionId, (err: Meteor.Error, result: any) => {
      this.setState({
        history: result,
        stepNumber: result.length - 1,
        loading: false
      });
    });
  }

  componentDidMount() {
    this.viewDelta();
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillReceiveProps() {
    this.loadData();
  }

  componentDidUpdate() {
    this.viewDelta();
  }

}
