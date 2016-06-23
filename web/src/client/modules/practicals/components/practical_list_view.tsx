import React from "react";

import { Meteor } from "meteor/meteor";

import SearchBar from "../../core/components/search_bar_view";
import PracticalItem from "./practical_item_view";


export interface IComponentProps {
  practicals: IPracticalDAO[];
  schedule: IScheduleDAO;
  header: string;
}

export interface IComponentActions {
  createPractical: () => void;
  handleSearch: (text: string) => void;
  clearSearch: () => void;
  context: () => IContext;
}

export interface IComponent extends IComponentProps, IComponentActions { }

export default class PracticalsView extends React.Component<IComponent, {}> {

  render() {
    const { Collections, Models: { Permission, Security } } = this.props.context();
    let practical: IPracticalDAO;

    return (
      <div>
        <div className="ui form top attached segment" id="adminForm">
          <h2 className="ui header">
            <i className="icon book" />
            <div className="content">{ mf("practicals.label") }</div>
          </h2>
          <SearchBar placeHolder="practical.search" onUserInput={this.props.handleSearch.bind(this) } />
        </div>
        <div className="ui bottom attached segment">
        <div>
          <If condition={this.props.practicals.length > 0}>
            <div className="ui items">
              <For each="practical" index="index" of={this.props.practicals}>
                <PracticalItem key={practical._id}
                  context={this.props.context}
                  canWrite={Permission.canWrite(practical.permissions, Meteor.user())}
                  practical={practical}
                  schedules={Collections.Schedules.find({ "items.practicalId": practical._id }).fetch()} />
              </For>
            </div>
          <Else />
            <If condition={this.props.schedule ? Permission.canWrite(this.props.schedule.permissions, Meteor.user()) : Security.isAdmin()}>
              <span>
                <div className="ui primary labeled icon button" id="createRecord" onClick={this.props.createPractical.bind(this)}>
                  <i className="icon plus" /> { mf("practical.add") }
                </div>
                { mf("confirm.createPractical") }
              </span>
            <Else />
              { mf("search.empty") }
            </If>
          </If>
        </div>
        </div>
      </div>
    );
  }
}
