import React from "react";
import ReactDOM from "react-dom";
import TabbedTextEditor from "../../text_editor/containers/tabbed_text_editor_container";
import PermissionAdmin from "../../admin/containers/permission_admin_container";
import DynamicView from "../../core/containers/dynamic_value_container";

// type imports
import Practical from "../../../models/practical_model";

export interface IComponentProps {
  practical: Practical;
}

export interface IComponentActions {
  delete: (practical: IPractical) => void;
  addExercise: (practical: IPractical, exerciseId: string) => void;
  removeExercise: (practical: IPractical, id: string) => void;
  duplicate: (practical: IPractical) => void;
  save: (practical: IPractical) => void;
  context?: IContext;
}

export interface IComponent extends IComponentProps, IComponentActions { }

export default class PracticalAdminView extends React.Component<IComponent, {}> {
  context: IContext;
  exerciseId: string;

  addExercise() {
    const exerciseName = this.refs["addExercise"]["value"];
    this.props.addExercise(this.props.practical, exerciseName);
  }

  handleTabChange(tabManager: ITabsManager) {
    let editorHolder = ReactDOM.findDOMNode<HTMLElement>(this.refs["editorHolder"]);
    if (editorHolder) {
      editorHolder.style.height = tabManager.tabs.length === 0 ? "60px" : "400px";
    }
  }

  previewDescription() {
    this.context.Utils.Ui.showMarkdownModal(this.props.practical.description);
  }

  previewLecture() {
    this.context.Utils.Ui.showMarkdownModal(this.props.practical.lecture);
  }

  //////////////////////////////////////////////////////////////////////////////
  // REACT                                                                    //
  //////////////////////////////////////////////////////////////////////////////

  renderExercise(exerciseId: string, key: string) {
    const { mf } = this.props.context;
    let exercise = {_id: "2", name: "2"}; // Exercises.findOne(exerciseId); // TODO!!!

    return (
      <div className="fields" key={key}>
        <div className="thirteen wide field">
          <label style={{ marginTop: 10 }}>
            <If condition={exercise}>
              <a href={this.context.Utils.Router.pathFor("adminExercise", {
                _id: exercise._id,
                name: this.context.Utils.Router.encodeUrlName(exercise.name)
              }) }>{exercise.name}</a>
            <Else />
              { mf("deleted") }
            </If>
          </label>
        </div>
        <div className="three wide field">
          <div className="ui fluid red icon labeled button" onClick={this.props.removeExercise.bind(this, this.props.practical, exerciseId) }>
            <i className="trash icon" /> { mf("remove") }
          </div>
        </div>
      </div>
    );
  }

  render() {
    this.context = this.props.context;

    const { practical } = this.props;
    const { Utils, mf } = this.props.context;
    const { Binding } = Utils;

    let exerciseId: string;
    let index: number;

    return (
      <div>
        <div className="ui breadcrumb">
          <a className="section" href={ Utils.Router.pathFor("practicals") }>{ mf("practicals.label") }</a>
          <i className="right right angle white white icon divider" />
          <div className="active section"><DynamicView owner={practical} func="nameChanged" value={(p: IPractical) => p.name} /></div>
        </div>

        <div className="ui segment form" id="adminForm">
          <h2 className="ui header">
            <i className="calendar outline icon" />
            <div className="content"><DynamicView owner={practical} func="nameChanged" value={(p: IPractical) => p.name} /></div>
          </h2>

          <div className="field">
            <label>{ mf("name") }</label>
            <input type="text" placeholder={ mf("practical.namePlaceholder") } defaultValue={practical.name} onChange={Binding.bind(this, "practical.name") } ref="name" />
          </div>
          <div className="field">
            <label>{ mf("image") }</label>
            <input type="text"
              placeholder={ mf("practical.imagePlaceholder") }
              defaultValue={this.props.practical.image}
              onChange={Binding.bind(this, "practical.image") } />
          </div>
          <div className="field">
            <label>{ mf("description") }</label>
            <textarea placeholder={ mf("practical.descriptionPlaceholder") }
              defaultValue={ this.props.practical.description }
              onChange={Binding.bind(this, "practical.description") }></textarea>
          </div>
          <div className="ui default right floated labeled icon button" onClick={this.previewDescription.bind(this) }>
            <i className="icon search" /> { mf("preview") }
          </div>
          <div className="field">
            <label>{ mf("lecture") }</label>
            <textarea placeholder={ mf("practical.lecturePlaceholder") }
              defaultValue={ this.props.practical.lecture }
              onChange={Binding.bind(this, "practical.lecture") }></textarea>
          </div>
          <div className="ui default right floated labeled icon button"  onClick={this.previewLecture.bind(this) }>
            <i className="icon search" /> { mf("preview") }
          </div>
          <div className="clear"></div>
        </div>

        <div className="ui top attached segment form">
          <h2>{ mf("exercises") }</h2>
          <div className="ui items">
            <For each="exerciseId" index="index" of={practical.exercises}>
              { this.renderExercise(exerciseId, index.toString()) }
            </For>
          </div>
        </div>

        <div className="ui bottom attached segment form">
          <div className="fields">
            <div className="ui fluid search thirteen wide field searchExercise">
              <input type="text" className="prompt" placeholder={ mf("practical.findExercisePlaceholder") } ref="addExercise" />
              <div className="results" />
            </div>
            <div className="three wide field">
              <div className="ui fluid default icon labeled button" onClick={this.addExercise.bind(this) }>
                <i className="plus icon" /> { mf("button.addExercise") }
              </div>
            </div>
          </div>
        </div>
        {/* FILES */}
        <div className="whiteEditor" ref="editorHolder" style={{ height: this.props.practical.files.length > 0 ? 400 : 60, position: "relative" }}>
          <TabbedTextEditor
            context={() => this.props.context}
            canModify={true}
            uniqueName="TextEditor"
            allowEditLibraries={true}
            hideLibraries={false}
            background="blackBackground"
            onTabsChanged={this.handleTabChange.bind(this)}
            files={this.props.practical.files} />
        </div>

        <div className="ui segment form">
          <h2>{ mf("permissions") }</h2>
          <PermissionAdmin permissions={this.props.practical.permissions} />
        </div>

        <div className="ui left floated red icon labeled button" onClick={this.props.delete.bind(this, practical) }>
          <i className="trash icon" /> { mf("delete") }
        </div>
        <div className="ui right floated primary submit icon labeled button save" onClick={this.props.save.bind(this)}>
          <i className="save icon" /> { mf("save") }
        </div>
        <div className="ui right floated default icon labeled button" onClick={this.props.duplicate.bind(this, practical) }>
          <i className="copy icon" /> { mf("duplicate") }
        </div>

      </div>
    );
  }

  componentDidMount() {
    throw "Not implemented!"
    // TODO !!
    // this.context.Utils.Ui.registerSaveListener(this);
    //
    // let self = this;
    // let exercises = Exercises.find();
    //
    // if (exercises.count()) {
    //   let values = exercises.map(
    //     function(p: IExerciseDAO) {
    //       return {
    //         title: p.name,
    //         description: self.context.Utils.Ui.previewMarkdown(p.description, 200),
    //         _id: p._id
    //       };
    //     });
    //
    //   $(".searchExercise").search({
    //     source: values,
    //     // onSearchQuery() {
    //     //   self.newExercise = null;
    //     // },
    //     // onSelect(result: { title: string, description: string, _id: string }, response: Object) {
    //     //   self.newExercise = result._id;
    //     // }
    //   });
    // }
  }
}
