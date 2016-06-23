import React from "react";
import ReactDOM from "react-dom";

import { FlowRouter } from "meteor/kadira:flow-router";

import { UiUtils, RouterUtils } from "../../../utils/helpers_client";
import { Worlds } from "../../../../common/collections";
import Uploads from "../../core/components/uploads_view";
import AdminBoardView from "./admin_board_view";
import TabbedTextEditor from "../../text_editor/containers/tabbed_text_editor_container";
import PermissionAdmin from "../../admin/containers/permission_admin_container";
import ApplicationState from "../../../models/application_state";
import ToolBox from "./toolbox_view";


//////////////////////////////////////////////////////////////////////////////
// ExerciseAdmin Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  exercise?: IExercise;
  context: () => IContext;
}

interface IExerciseAdminState {
  name?: string;
  worldId?: string;
  boards?: IBoard[];
}

export default class ExerciseAdminView extends React.Component<IComponentProps, IExerciseAdminState> {
  constructor(props: IComponentProps) {
    super();
    this.state = {
      name: props.exercise.name,
      worldId: props.exercise.worldId,
      boards: props.exercise.boards
    };
  }

  get callbacks(): any {
    let self = this;
    return {
      context: function() {
        return {
          _id: self.props.exercise._id,
          name: RouterUtils.encodeUrlName(self.props.exercise.name),
          root: "exercise"
        };
      }
    };
  }

  //////////////////////////////////////////////////////////////////////////////
  // EVENTS                                                                   //
  //////////////////////////////////////////////////////////////////////////////

  delete() {
    UiUtils.confirmDialog("confirm.delete", () => {
      this.props.exercise.delete(UiUtils.announceDeleted(() => {
        FlowRouter.go("schedules");
      }));

      UiUtils.deletedDialog();
    });
  }

  duplicate() {
    const Utils = this.props.context().Utils;
    const Exercise = this.props.context().Models.Exercise;

    Utils.Ui.confirmDialog("confirm.duplicate", () => {
      let exercise = new Exercise(this.props.exercise.getDAO());
      exercise._id = null;
      exercise.name += "(Clone)";

      exercise.save(UiUtils.announceDuplicated((error: Meteor.Error) => {
        if (!error) {
          RouterUtils.go("adminExercise", { _id: exercise._id, name: RouterUtils.encodeUrlName(exercise.name) });
        }
      }));
    }, "areYouSure", "duplicate", "info", true);
  }

  handleTabChange(tabs: any[]) {
    let editorHolder = ReactDOM.findDOMNode<HTMLElement>(this.refs["editorHolder"]);
    if (editorHolder) {
      editorHolder.style.height = tabs.length === 0 ? "60px" : "400px";
    }
  }

  previewDescription() {
    UiUtils.showMarkdownModal(this.props.exercise.description);
  }

  changeName(e: React.SyntheticEvent) {
    ApplicationState.editorDirty = true;
    let name = e.currentTarget["value"];
    this.props.exercise.name = name;
    this.setState({ name: name });
  }

  save() {
    this.props.exercise.save(UiUtils.announceSaved(ApplicationState.reset));
  }


  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  render() {
    let worlds = Worlds.find({}, { reactive: false }).fetch();
    const binding = this.props.context().Utils.Binding;

    // backward compatibility
    if (!this.props.exercise.linesOfCode.cheatDetection) {
      this.props.exercise.linesOfCode.cheatDetection = 0;
    }

    return (
      <div>
        <div className="ui breadcrumb" style={{ marginBottom: 20 }}>
          <a className="section" href={ RouterUtils.pathFor("exercises") }>{ mf("exercises") }</a>
          <i className="right right angle white white icon divider" />
          <div className="active section">{ this.state.name }</div>
        </div>
        <div id="adminExerciseForm">
          <div className="ui form" id="adminForm">
            <div className="ui segment" id="basicDetails">
              <div className="field">
                <label>{ mf("exercise.name") }</label>
                <input type="text"
                  placeholder={ mf("exercise.namePlaceholder") }
                  defaultValue={ this.state.name }
                  onChange={this.changeName.bind(this) } />
              </div>
              <div className="field">
                <label>{ mf("description") }</label>
                <textarea placeholder={ mf("exercise.descriptionPlaceholder") }
                  defaultValue={this.props.exercise.description}
                  onChange={binding.bind(this, "exercise.description") }></textarea>
              </div>
              <div className="ui default right floated labeled icon button" onClick={this.previewDescription.bind(this) }>
                <i className="icon search" /> { mf("preview") }
              </div>
              <div className="three fields clear">
                <div className="field">
                  <label>{ mf("points") }</label>
                  <input type="number"
                    placeholder="Points"
                    step="0.25"
                    defaultValue={this.props.exercise.points.toString() }
                    onChange={binding.bind(this, "exercise.points", "float") } />
                </div>
                <div className="field">
                  <label>{ mf("difficulty") }</label>
                  <select className="ui dropdown exerciseDropdown"
                    defaultValue={this.props.exercise.difficulty.toString() }
                    ref="difficulty">
                    <option value="0">{ mf("exercise.easy") }</option>
                    <option value="1">{ mf("exercise.medium") }</option>
                    <option value="2">{ mf("exercise.hard") }</option>
                    <option value="3">{ mf("exercise.hardcore") }</option>
                  </select>
                </div>
                <div className="field">
                  <label>{ mf("world") }</label>
                  <select className="ui dropdown exerciseDropdown" ref="worlds" defaultValue={this.props.exercise.worldId}>
                    <option value="">{ mf("exercise.selectWorld") }</option>
                    { worlds.map((world: IWorldDAO) => {
                      return <option key={world._id} value={world._id}>{ world.name}</option>;
                    }) }
                  </select>
                </div>
              </div>
              <div className="four fields">
                <div className="field">
                  <label>{ mf("exercise.oneStar") }</label>
                  <div className="ui labeled input">
                    <div className="ui label">
                      <span className="ratingOk">★</span>
                    </div>
                    <input type="number"
                      placeholder={ mf("exercise.loc1") }
                      defaultValue={ this.props.exercise.linesOfCode.oneStar.toString() }
                      onChange={binding.bind(this, "exercise.linesOfCode.oneStar", "int") } />
                  </div>
                </div>
                <div className="field">
                  <label>{ mf("exercise.twoStars") }</label>
                  <div className="ui labeled input">
                    <div className="ui label">
                      <span className="ratingOk">★ ★</span>
                    </div>
                    <input type="number"
                      placeholder={ mf("exercise.loc2") }
                      defaultValue={ this.props.exercise.linesOfCode.twoStars.toString() }
                      onChange={binding.bind(this, "exercise.linesOfCode.twoStars", "int") } />
                  </div>
                </div>
                <div className="field">
                  <label>{ mf("exercise.threeStars") }</label>
                  <div className="ui labeled input">
                    <div className="ui label">
                      <span className="ratingOk">★ ★ ★</span>
                    </div>
                    <input type="number"
                      placeholder={ mf("exercise.loc3") }
                      defaultValue={ this.props.exercise.linesOfCode.threeStars.toString() }
                      onChange={binding.bind(this, "exercise.linesOfCode.threeStars", "int") } />
                  </div>
                </div>
                <div className="field">
                  <label>{ mf("exercise.cheatDetection") }</label>
                  <div className="ui labeled input">
                    <div className="ui label">
                      <span className="ratingOk">:(</span>
                    </div>
                    <input type="number"
                      placeholder={ mf("exercise.loc3") }
                      defaultValue={ this.props.exercise.linesOfCode.cheatDetection.toString() }
                      onChange={binding.bind(this, "exercise.linesOfCode.cheatDetection", "int") } />
                  </div>
                </div>
              </div>
              <div className="fields">
                <div className="twelve wide field">
                  <label>{ mf("image") }</label>
                  <input type="text"
                    placeholder={ mf("exercise.mainImage") }
                    defaultValue={ this.props.exercise.image }
                    onChange={binding.bind(this, "exercise.image") } />
                </div>
                <div className="four wide field">
                  <label>&nbsp; </label>
                  <div className="ui toggle checkbox" style={{ marginTop: 3 }}>
                    <input
                      type="checkbox"
                      defaultChecked={ this.props.exercise.protectLoops }
                      onChange={binding.bind(this, "exercise.protectLoops", "checked") } />
                    <label>{ mf("exercise.protectLoops") }</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="ui segment">
              <div className="field">
                <label>{ mf("files") }</label>
                <Uploads
                  images={this.props.exercise.images}
                  directive="exerciseUploads"
                  callbacks={this.callbacks}
                  saveable={this.props.exercise}
                  owner={this.props.exercise._id}
                  />
              </div>
            </div>

            <div className="whiteEditor"
              ref="editorHolder"
              style={{ height: this.props.exercise.files.length > 0 ? 400 : 60, position: "relative" }}>
              <TabbedTextEditor
                context={this.props.context}
                canModify={true}
                uniqueName="TextEditor"
                onTabsChanged={this.handleTabChange.bind(this)}
                allowEditLibraries={true}
                hideLibraries={false}
                files={this.props.exercise.files} />
            </div>

            <AdminBoardView
              exercise={this.props.exercise}
              boards={ this.state.boards } />

            <div className="ui segment">
              <h2>{ mf("permissions") }</h2>
              <PermissionAdmin permissions={this.props.exercise.permissions} />
            </div>

            <div className="ui left floated red icon labeled button" onClick={this.delete.bind(this) }>
              <i className="trash icon" /> { mf("delete") }
            </div>
            <div className="ui right floated primary submit icon labeled button save" onClick={this.save.bind(this) }>
              <i className="save icon" /> { mf("save") }
            </div>
            <div className="ui right floated default icon labeled button" onClick={this.duplicate.bind(this) }>
              <i className="copy icon" /> { mf("duplicate") }
            </div>
          </div>
        </div>

        <ToolBox worldId={this.state.worldId} />
      </div>

    );
  }

  componentDidMount() {

    // handle dropdowns

    let self = this;
    $(ReactDOM.findDOMNode(this.refs["difficulty"])).dropdown({
      on: "hover",
      onChange: function(value: number) {
        self.props.exercise.difficulty = value;
      }
    });

    $(ReactDOM.findDOMNode(this.refs["worlds"])).dropdown({
      on: "hover",
      onChange: function(value: string) {
        self.props.exercise.worldId = value;
        self.setState({ worldId: value });
      }
    });

    // setup saving

    UiUtils.registerSaveListener(this);
  }
}
