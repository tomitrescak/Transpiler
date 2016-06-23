import React from "react";

import LeaderboardResults, { exerciseLeaderboardsRoute, scheduleLeaderboardsRoute } from "./leaderboards_results_view";


export interface IComponentProps {
  schedule: IScheduleDAO;
  practical: IPracticalDAO;
  exercises: IExerciseDAO[];
  results: IResultsDAO[];
  context: () => IContext;
}

export default class LeaderboardsPracticalView extends React.Component<IComponentProps, {}> {
  render() {
    const { Utils } = this.props.context();
    let exercise: IExerciseDAO;

    return (
      <div>
        <div className="ui breadcrumb" style={{ marginBottom: 0 }}>
          <a className="section" href={Utils.Router.pathFor("leaderboards") }>{ mf("results.title") }</a>
          <i className="right right angle white white icon divider" />
          <a className="section" href={scheduleLeaderboardsRoute(this.props.context(), this.props.schedule) }>{ this.props.schedule.name }</a>
          <i className="right right angle white white icon divider"></i>
          <div className="active section">{ this.props.practical.name }</div>
        </div>
        <div className="ui grid" style={{ marginTop: 15 }}>
          <div className="six wide column">
            <h2 className="ui top attached header">
              <i className="trophy icon" />
              <div className="content" style={{ width: "100%" }}>
                { this.props.schedule.name }
                <div className="sub header">
                  { mf("results.practicalsInstructions") }
                </div>
              </div>
            </h2>
            <div className="ui bottom attached segment">
              <div className="ui relaxed divided list">
                <For each="exercise" index="index" of={this.props.exercises}>
                <a key={exercise._id} className="ui item"
                  href={ exerciseLeaderboardsRoute(this.props.context(), this.props.schedule, this.props.practical, exercise) }>{exercise.name}</a>
                </For>
              </div>
            </div>
          </div>
          <div className="ten wide column">
            <LeaderboardResults results={this.props.results} />
          </div>
        </div>
      </div>
    );
  }
}
