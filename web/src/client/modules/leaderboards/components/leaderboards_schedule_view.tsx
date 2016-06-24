import React from "react";
import LeaderboardResults, { practicalLeaderboardsRoute } from "./leaderboards_results_view";




//////////////////////////////////////////////////////////////////////////////
// LeaderboardsView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  schedule: IScheduleDAO;
  practicals: IPracticalDAO[];
  results: IResultsDAO[];
  context: () => IContext;
}

export default class LeaderboardsScheduleView extends React.Component<IComponentProps, {}> {
  render() {
    const { Utils } = this.props.context();

    return (
      <div>
        <div className="ui breadcrumb" style={{ marginBottom: 0 }}>
          <a className="section" href={Utils.Router.pathFor("leaderboards") }>{ mf("results.title") }</a>
          <i className="right right angle white white icon divider" />
          <div className="active section">{ this.props.schedule.name }</div>
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
                { this.props.practicals.map((practical: IPracticalDAO) => {
                  return <a key={practical._id} className="ui item" href={practicalLeaderboardsRoute(this.props.context(), this.props.schedule, practical) }>{practical.name}</a>;
                }) }
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
