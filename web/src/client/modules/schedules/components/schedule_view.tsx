import React from "react";

import { Meteor } from "meteor/meteor";

import PracticalItem from "../../practicals/containers/practical_item_container";
import ScheduleSubscription from "../containers/schedule_subscription_container";
import Play from "../../core/components/play_container";

//////////////////////////////////////////////////////////////////////////////
// ScheduleView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  schedule: IScheduleDAO;
  visibleItems: IScheduleItemDAO[];
  context: () => IContext;
}

class ScheduleView extends React.Component<IComponentProps, {}> {
  renderPracticalItem(item: IScheduleItemDAO, practical: IPracticalDAO, scheduleId: string) {
    if (practical) {
      const today = new Date();
      const isVisible = item.from <= today;

      return <PracticalItem key={practical._id} scheduleId={scheduleId} practical={practical} isVisible={isVisible} />;
    }
  }
  render() {
    const { Utils, Models: { Security }, Collections } = this.props.context();
    const { name, _id, description } = this.props.schedule;

    let item: IScheduleItemDAO;
    return (
        <div>
            <div className="ui breadcrumb" style={{marginBottom: 0}}>
                <a className="section" href={Utils.Router.pathFor("schedules")}>{ mf("schedules.label") }</a>
                <i className="right angle white icon divider" />
                <div className="active section">{ name }</div>
            </div>

            <div className="ui top attached segment">
                <h2 className="ui header">
                    <i className="archive icon" />
                    <div className="content" style={{width: "100%"}}>
                        <If condition={Security.isAdmin()}>
                            <a href={ Utils.Router.pathFor("adminSchedule", {
                                        _id: _id,
                                        name: Utils.Router.encodeUrlName(name)})}
                               className="ui right floated labeled orange icon button">
                                <i className="edit icon" /> { mf("modify") }
                            </a>
                        </If>
                        {/*<If condition={Security.isTutor()}>
                            <a href={ Utils.Router.pathFor("adminSchedule", {
                                        _id: _id,
                                        name: Utils.Router.encodeUrlName(name)})}
                               className="ui right floated labeled default icon button">
                               <i className="users icon" /> { mf("users") }
                            </a>
                        </If>*/}
                        <a href={ Utils.Router.pathFor("scheduleLeaderboards", {
                                    _id: _id,
                                    name: Utils.Router.encodeUrlName(name)})}
                           className="ui right floated green icon button">
                          <i className="trophy icon" style={{margin: 0}} />
                        </a>
                        { name }
                        <div className="sub header">{ description }</div>
                    </div>
                </h2>
                <div className="ui items">
                  <For each="item" index="index" of={this.props.visibleItems}>
                    { this.renderPracticalItem(item, Collections.Practicals.findOne(item.practicalId, { reactive: false }), this.props.schedule._id) }
                  </For>
                </div>
            </div>
            <If condition={this.props.schedule.tutors.length > 0}>
              <div className="ui bottom attached segment">
                  <div style={{textAlign: "right"}}>
                    <If condition={Meteor.user()}>
                      <ScheduleSubscription scheduleId={_id} tutors={this.props.schedule.tutors} context={this.props.context} />
                    </If>
                  </div>
              </div>
            </If>
        </div>
    );
  }
}

export default ScheduleView;
