import React from "react";


import LeaderboardResults, { scheduleLeaderboardsRoute, practicalLeaderboardsRoute } from "./leaderboards_results_view";

//////////////////////////////////////////////////////////////////////////////
// LeaderboardsView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  schedule: IScheduleDAO;
  practical: IPracticalDAO;
  exercise: IExerciseDAO;
  results: IResultsDAO[];
  context: () => IContext;
}

export default class LeaderboardsExerciseView extends React.Component<IComponentProps, {}> {
  render() {
    const { Utils } = this.props.context();

    return (
      <div>
        <div className="ui breadcrumb" style={{ marginBottom: 0 }}>
          <a className="section" href={Utils.Router.pathFor("leaderboards") }>{ mf("results.title") }</a>
          <i className="right right angle white white icon divider" />
          <a className="section" href={scheduleLeaderboardsRoute(this.props.context(), this.props.schedule) }>{ this.props.schedule.name }</a>
          <i className="right right angle white white icon divider" />
          <a className="section" href={practicalLeaderboardsRoute(this.props.context(), this.props.schedule, this.props.practical) }>{ this.props.practical.name }</a>
          <i className="right right angle white white icon divider"></i>
          <div className="active section">{ this.props.exercise.name }</div>
        </div>

        <h2 className="ui top attached header">
          <i className="trophy icon" />
          <div className="content" style={{ width: "100%" }}>
            { mf("results.exerciseTitle") }
          </div>
        </h2>
        <LeaderboardResults results={this.props.results} />
      </div>
    );
  }
}
