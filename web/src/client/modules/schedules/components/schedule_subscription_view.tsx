import React from "react";
import ReactDOM from "react-dom";

import { Meteor } from "meteor/meteor";

export interface IComponentProps {
  scheduleId: string;
  subscription: IScheduleSubscription;
  tutors: IScheduleTutorDAO[];
}

export interface IComponentActions {
  subscribe: (scheduleId: string, tutorId: string) => void;
  unsubscribe: (scheduleId: string) => void;
  context: () => IContext;
}

export interface IComponent extends IComponentProps, IComponentActions { }

export class ScheduleSubscription extends React.Component<IComponent, {}> {
  initDropdown() {
    let dropdown = ReactDOM.findDOMNode(this.refs["tutors"]);
    $(dropdown).dropdown({ on: "hover" });
  }

  render() {

    if (!Meteor.user()) {
      return;
    }

    return (
      <div>
        <If condition={this.props.subscription}>
          <div className="ui default button unsubscribe" onClick={this.props.unsubscribe.bind(this, this.props.scheduleId) }>
              <i className="trash icon" /> { mf("schedule.unsubscribeWith") } { this.props.subscription.tutorName }
          </div>
        <Else />
        <div className="ui selection dropdown tutorDropdown" ref="tutors" style={{width: 200}}>
            <input type="hidden" name="tutor" ref="tutor" />
            <div className="default text">{ mf("schedule.selectTutor") }</div>
            <i className="dropdown icon" />
            <div className="menu">
              {
                this.props.tutors.map((tutor: IScheduleTutorDAO) => {
                  return <ScheduleSubscriptionTutor key={tutor.id} tutor={tutor} subscribed={this.props.subscribe.bind(this, this.props.scheduleId, tutor) } />;
                })
              }
            </div>
        </div>
        </If>
      </div>
    );
  }

  componentDidMount() {
    this.initDropdown();
  }

  componentDidUpdate() {
    this.initDropdown();
  }
}

//////////////////////////////////////////////////////////////////////////////
// ScheduleSubscriptionItem Component                                       //
//////////////////////////////////////////////////////////////////////////////

interface IScheduleSubscriptionTutorProps {
  key: string;
  tutor: IScheduleTutorDAO;
  subscribed: (tutor: IScheduleTutorDAO) => void;
}

class ScheduleSubscriptionTutor extends React.Component<IScheduleSubscriptionTutorProps, {}> {
  handleSubscribe() {
    this.props.subscribed(this.props.tutor);
  }

  render() {
    return <div className="item subscribe" onClick={ this.handleSubscribe.bind(this) }>{ this.props.tutor.name }</div>;
  }
}

//////////////////////////////////////////////////////////////////////////////
// TutorModal Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export class TutorModal extends React.Component<IComponent, {}> {
  close() {
    $("#tutorModal").modal("hide");
  }

  render() {
      return (
        <div className="ui small modal" id="tutorModal">
            <i className="close icon" />
            <div className="header">{ mf("selectTutor.header") }</div>
            <div className="content" style={{textAlign: "center"}}>
                <ScheduleSubscription {...this.props} />
            </div>
            <div className="actions">
                <div className="ui primary button" onClick={this.close}>
                    { mf("close") }
                </div>
            </div>
        </div>
      );
  }
}

export default ScheduleSubscription;
