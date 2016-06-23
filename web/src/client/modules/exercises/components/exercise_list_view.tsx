import React from "react";
import SearchBar from "../../core/components/search_bar_view";
import ExerciseItem from "./exercise_item_view";

///////////////////////////////////////////////////////////////////////////
// ExercisesView Component                                               //
///////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  exercises?: IExerciseDAO[];
  context: () => IContext;
}

export interface IComponentActions {
  createExercise: () => void;
  handleSearch: (text: string) => void;
  clearSearch: () => void;
  context: () => IContext;
}

export interface IComponent extends IComponentProps, IComponentActions { }

export default class ExercisesView extends React.Component<IComponent, {}> {
  render() {
    const Security = this.props.context().Models.Security;
    let exercise: IExerciseDAO;

    return (
      <div>
        <div className="ui form top attached segment" id="adminForm">
          <h2 className="ui header">
            <i className="icon book" />
            <div className="content">{ mf("exercises.label") }</div>
          </h2>
          <SearchBar placeHolder="search.exercise" onUserInput={this.props.handleSearch.bind(this) } />
        </div>
        <div className="ui bottom attached segment">
          <div>
            <If condition={this.props.exercises.length > 0}>
              <div className="ui items">
                <For each="exercise" index="index" of={this.props.exercises}>
                  <ExerciseItem key={exercise._id} exercise={exercise} context={this.props.context}  />
                </For>
              </div>
              <Else />
              <If condition={ Security.isAdmin() }>
                <span>
                  <div className="ui primary labeled icon button" id="createRecord" onClick={this.props.createExercise.bind(this)}>
                    <i className="icon plus" /> { mf("exercise.add") }
                  </div>
                  { mf("confirm.createExercise") }
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
