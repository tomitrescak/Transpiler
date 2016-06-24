import React from "react";
import ReactDOM from "react-dom";

import { UiUtils, RouterUtils } from "../../../utils/helpers_client";
import StarRating from "../../core/components/star_rating_view";

//////////////////////////////////////////////////////////////////////////////
// ExerciseItemView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IExerciseItemViewProps {
  key: string;
  exercise: IExerciseDAO;
  practical?: IPracticalDAO;
  schedule?: IScheduleDAO;
  solution?: ISolutionDAO;
  context: () => IContext;
}

interface IExerciseItemViewState {
  status: string;
}

export default class ExerciseItemView extends React.Component<IExerciseItemViewProps, IExerciseItemViewState> {
  constructor(props: IExerciseItemViewProps) {
    super();
    this.state = {
      status: props.solution ? props.solution.status : null
    };
  }

  //////////////////////////////////////////////////////////////////////////////
  // HELPERS                                                                  //
  //////////////////////////////////////////////////////////////////////////////

  scheduledExercises(): Object[] {
    let result: Object[] = [];
      // find all practicals where this exercises is
      let pracs = Practicals.find({exercises: this.props.exercise._id}, { reactive: false }).fetch();

      if (pracs.length) {
        // find all schedules where this practical is
        for (let prac of pracs) {
          let schedules = Schedules.find({ "items.practicalId": prac._id}, { reactive: false }).fetch();

          // now create all paths and names
          for (let schedule of schedules) {
            result.push({
              name: prac.name + " > " + schedule.name,
              scheduleId: schedule._id,
              scheduleName: RouterUtils.encodeUrlName(schedule.name),
              practicalId: prac._id,
              practicalName: RouterUtils.encodeUrlName(prac.name),
              exerciseId: this.props.exercise._id,
              exerciseName: RouterUtils.encodeUrlName(this.props.exercise.name)
            });
          }
        }
      }
      return result;
  }

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  checkTutor(e: React.SyntheticEvent) {
    if (!this.props.schedule) {
      return;
    }

    if (Meteor.user()) {
      if (this.props.schedule.tutors.length > 0) {
        if (!UserOptions.info().getScheduleSubscription(this.props.schedule._id)) {
          const { Utils } = this.props.context();
          Utils.Ui.alertDialog("error.notSubscribed", "error.subscriptionError");
          e.preventDefault();
          return;
        }
      }
    }

    RouterUtils.go("exercise", {
      exerciseName: RouterUtils.encodeUrlName(this.props.exercise.name),
      practicalName: RouterUtils.encodeUrlName(this.props.practical.name),
      scheduleName: RouterUtils.encodeUrlName(this.props.schedule.name),
      exerciseId: this.props.exercise._id,
      practicalId: this.props.practical._id,
      scheduleId: this.props.schedule._id
    });
  }

  // "click .exerciseDetail":
  previewExercise(e: React.SyntheticEvent) {
    e.preventDefault();

    // create html using showdown converter
    UiUtils.showMarkdownModal(this.props.exercise.description);
  }

  submitSolution() {
    let self = this;
    changeStatus.call({ solutionId: this.props.solution._id, status: "Submitted" }, UiUtils.announceSaved((err: Meteor.Error) => {
      if (!err) {
        self.setState({
          status: "Submitted"
        });
      }
    }));
  }

  // "click .removeSubmission":
  removeSubmission() {
    let self = this;
    changeStatus.call({ solutionId: this.props.solution._id, status: "Open" }, UiUtils.announceSaved((err: Meteor.Error) => {
      if (!err) {
        self.setState({
          status: "Open"
        });
      }
    }));
  }

  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  render() {
    let scheduledExercises: Object[] = null;
    if (!this.props.practical) {
      scheduledExercises = this.scheduledExercises();
    }
    let index: number;
    let routeParams: Object;

    return (
      <div className="item">
          <div className="image previewImage">
              <a className="ui left corner label exerciseDetail" onClick={this.previewExercise.bind(this)}>
                  <i className="search icon" />
              </a>
              <img src={ this.props.exercise.image ? (GlobalConfig.S3Bucket + this.props.exercise.image) : "/images/wireframe.png" } />
          </div>
          <div className="content">
              <span className="header exerciseLink" style={{marginBottom: 6}}>
                <If condition={Permission.canWrite(this.props.exercise.permissions, Meteor.user())}>
                  <a href={ RouterUtils.pathFor("adminExercise", {
                              _id: this.props.exercise._id,
                              name: RouterUtils.encodeUrlName(this.props.exercise.name)
                             }) }
                     className="ui compact icon orange button">
                      <i className="edit icon" />
                  </a>
                </If>
                <If condition={this.props.practical}>
                  <a className="header exerciseLink" onClick={this.checkTutor.bind(this)}>{ this.props.exercise.name }</a>
                </If>
                <If condition={this.props.practical == null && scheduledExercises.length > 1}>
                  <div className="ui dropdown" ref="dropdown">
                      <div className="header text">
                          <h3>{ this.props.exercise.name }</h3>
                      </div>
                      <i className="dropdown icon" />
                      <div className="menu">
                        <For each="routeParams" index="index" of={scheduledExercises}>
                          <a key={index} className="item" href={RouterUtils.pathFor("exercise", routeParams)}>{ routeParams["name"] }</a>
                        </For>
                      </div>
                  </div>
                </If>
                <If condition={this.props.practical == null && scheduledExercises.length === 1}>
                  <a className="header exerciseLink"
                    href={RouterUtils.pathFor("exercise", scheduledExercises[0])}>{ this.props.exercise.name }</a>
                </If>
                <If condition={this.props.practical == null && scheduledExercises.length === 0}>
                  { this.props.exercise.name }
                </If>
                <If condition={this.props.solution && this.props.solution.validated}>
                  <span>
                    &nbsp;· <StarRating codeStars={this.props.solution.codeStars} stepsStars={this.props.solution.stepsStars} /> ·
                      <span className="ui green label">{ mf("solution.completed") }</span>
                      <If condition={this.props.solution.status === "Marked"}>
                        <span className="ui blue label">{ mf("solution.mark") }: { this.props.solution.mark }</span>
                      </If>
                  </span>
                </If>

              </span>
              <div className="meta" style={{marginTop: 3}}>
                <span className="cinema">
                  {/*<If condition={this.props.solution && this.props.solution.validated}>
                    <span>
                      <a href={ RouterUtils.pathFor("exerciseLeaderboards", {
                                    exerciseName: RouterUtils.encodeUrlName(this.props.exercise.name),
                                    practicalName: RouterUtils.encodeUrlName(this.props.practical.name),
                                    scheduleName: RouterUtils.encodeUrlName(this.props.schedule.name),
                                    exerciseId: this.props.exercise._id,
                                    practicalId: this.props.practical._id,
                                    scheduleId: this.props.schedule._id
                                  }) }>
                          { mf("solution.rank") }{ this.props.solution.rank }</a> ·
                    </span>
                  </If>*/}
                  <If condition={this.props.solution}>
                    <span>{mf("modified")}{UiUtils.relativeDate(this.props.solution.updatedAt)} · </span>
                  </If>
                  <If condition={this.props.exercise.points}>
                    <span>{ this.props.exercise.points }{ mf("exercise.points") }</span>
                  </If>
                </span>
              </div>
              <div className="description">
                { UiUtils.previewMarkdown(this.props.exercise.description, 300) }
              </div>
              <div className="extra">
                <If condition={this.props.solution && this.state.status === "Submitted"}>
                  <div className="ui right floated labeled icon orange removeSubmission button" onClick={this.removeSubmission.bind(this)}>
                    <i className="erase icon" /> { mf("solution.removeSubmission") }
                  </div>
                </If>
                <If condition={this.props.solution && this.state.status === "Open"}>
                  <div className="ui right floated labeled icon green submitSolution button" onClick={this.submitSolution.bind(this)}>
                      <i className="edit icon" /> { mf("solution.submit") }
                  </div>
                </If>
              </div>
          </div>
      </div>
    );
  }

  componentDidMount() {
    let dropdown = ReactDOM.findDOMNode(this.refs["dropdown"]);
    if (dropdown) {
      console.log("Enabling DR");
      $(dropdown).dropdown({ on: "hover" });
    }
  }
}
