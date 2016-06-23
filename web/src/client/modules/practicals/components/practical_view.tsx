import React from "react";

import { Meteor } from "meteor/meteor";

import SearchBar from "../../core/components/search_bar_view";
import ExerciseItem from "../../exercises/components/exercise_item_view";
import TutorModal from "../../schedules/containers/schedule_subscription_container";

import { practicalLeaderboardsRoute } from "../../leaderboards/components/leaderboards_results_view";

export interface IComponentProps {
  schedule: IScheduleDAO;
  practical: IPracticalDAO;
  exercises: IExerciseDAO[];
  solutions: ISolutionDAO[];
}

export interface IComponentActions {
  createExercise: () => void;
  zipPath: (scheduleId: string, practicalId: string) => string;
  resultsPath: (scheduleId: string, practicalId: string) => string;
  handleSearch: (text: string) => void;
  context: () => IContext;
}

export interface IComponent extends IComponentProps, IComponentActions { }

export default class PracticalView extends React.Component<IComponent, {}> {

  context: IContext;

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  previewPractical(e: React.SyntheticEvent) {
    const { Utils } = this.context;
    Utils.Ui.showMarkdownModal(this.props.practical.description);
  }

  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  renderExercise(exercise: IExerciseDAO) {
    let solution = this.context.Collections.Solutions.findOne({ createdById: Meteor.userId(), scheduleId: this.props.schedule._id, practicalId: this.props.practical._id, exerciseId: exercise._id }, { reactive: false });
    return (
      <ExerciseItem
        key={exercise._id}
        exercise={exercise}
        practical={this.props.practical}
        schedule={this.props.schedule}
        solution={solution}
        context={this.props.context} />
    );
  }

  render() {
    this.context = this.props.context();
    let dueDate: Date = this.props.schedule.items.find(w => w.practicalId == this.props.practical._id).due;
    let exercise: IExerciseDAO;
    const { Utils, Models: { Security, Permission } } = this.props.context();

    return (
      <div>
        <div className="ui breadcrumb" style={{ marginBottom: 0 }}>
          <a className="section" href={ Utils.Router.pathFor("schedules") }>{ mf("schedules.label") }</a>
          <i className="right right angle white white icon divider" />
          <a className="section" href={ Utils.Router.pathFor("schedule", { _id: this.props.schedule._id, name: Utils.Router.encodeUrlName(this.props.schedule.name) }) }>{ this.props.schedule.name }</a>
          <i className="right right angle white white icon divider" />
          <div className="active section">{ this.props.practical.name }</div>
        </div>
        <div className="ui form segment" id="adminForm">
          <h2 className="ui header" style={{ marginBottom: 0 }}>
            <i className="archive icon" />
            <div className="content" style={{ width: "100%" }}>
              <a href="#" className="practicalTitle"  onClick={this.previewPractical.bind(this) }>{ this.props.practical.name }</a>
              <If condition={Security.isTutor() }>
                <a href={ Utils.Router.pathFor("marking", { scheduleId: this.props.schedule._id, practicalId: this.props.practical._id }) }
                  className="ui right floated labeled primary icon button">
                  <i className="legal icon" /> { mf("tutor.marking") }
                </a>
                <a href={ this.props.resultsPath(this.props.schedule._id, this.props.practical._id) } className="ui right floated primary icon button" target="_self">
                  <i className="cloud download icon" style={{ margin: 0 }} />
                </a>
              </If>
              <If condition={Permission.canWrite(this.props.practical.permissions, Meteor.user()) }>
                <a href={ Utils.Router.pathFor("adminPractical", { _id: this.props.practical._id, name: Utils.Router.encodeUrlName(this.props.practical.name) }) }
                  className="ui right floated labeled orange icon button">
                  <i className="edit icon" /> { mf("modify") }
                </a>
              </If>
              <If condition={this.props.solutions.length}>
                <a href={ this.props.zipPath(this.props.schedule._id, this.props.practical._id) } className="ui right floated labeled icon zip button" target="_self">
                  <i className="compress icon" /> { mf("downloadZIP") }
                </a>
              </If>
              {/*<a href="#" className="ui right floated icon button practicalTitle" onClick={this.previewPractical.bind(this) }>
                <i className="info icon" style={{ margin: 0 }} />
              </a>*/}
              <a href={ practicalLeaderboardsRoute(this.props.context(), this.props.schedule, this.props.practical) }
                className="ui right floated green icon button">
                <i className="trophy icon" style={{ margin: 0 }} />
              </a>
            </div>
          </h2>
          <SearchBar placeHolder="practical.search" onUserInput={this.props.handleSearch.bind(this) } />

          <div>
            <If condition={this.props.exercises.length > 0}>
              <div className="ui items">
                <For each="exercise" index="index" of={this.props.exercises}>
                  { this.renderExercise(exercise) }
                </For>
              </div>
              <Else />
                <If condition={Permission.canWrite(this.props.practical.permissions, Meteor.user())}>
                  <span>
                    <div className="ui primary labeled icon button" id="createRecord" onClick={this.props.createExercise.bind(this, this.props.practical) }>
                      <i className="icon plus" /> { mf("exercise.add") }
                    </div>
                    { mf("confirm.createExercise") }
                  </span>
                <Else />
                  { mf("search.empty") }
                </If>
            </If>
          </div>
          <If condition={dueDate}>
            <div className="ui vertical segment" style={{ textAlign: "right" }}>
              <span className={Utils.Css("ui label", { red: new Date() > dueDate }) }>Due { Utils.Ui.relativeDate(dueDate) }</span>
            </div>
          </If>
        </div>
        { this.props.schedule.tutors.length > 0 && Meteor.user() ? <TutorModal scheduleId={this.props.schedule._id} tutors={this.props.schedule.tutors} /> : "" }
      </div>
    );
  }
}
