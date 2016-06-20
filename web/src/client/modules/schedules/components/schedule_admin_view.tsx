import React from "react";
import ReactDOM from "react-dom";

//import Schedule from "../../../models/schedule_model";
import TextEditorModel from "../../text_editor/components/tabbed_text_editor_model";

import TabbedTextEditor from "../../text_editor/containers/tabbed_text_editor_container";
import PermissionAdmin from "../../admin/containers/permission_admin_container";

//////////////////////////////////////////////////////////////////////////////
// ScheduleAdminView Component                                              //
//////////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  context?: () => IContext;
  schedule: ISchedule;
  practicals: IScheduleItemDAO[];
  tutors: IScheduleTutorDAO[];
}

export interface IComponentActions {
  addPractical: (schedule: ISchedule, practical: IScheduleItemDAO) => void;
  addTutor: (schedule: ISchedule, tutor: IScheduleTutorDAO) => void;
  delete: (schedule: ISchedule) => void;
  deletePractical: (schedule: ISchedule, tutor: IScheduleTutorDAO) => void;
  deleteTutor: (schedule: ISchedule, tutor: IScheduleTutorDAO) => void;
  duplicate: (schedule: ISchedule) => void;
  context?: () => IContext;
}

export interface IComponent extends IComponentProps, IComponentActions { }

export default class ScheduleAdminView extends React.Component<IComponent, {}> {
  newPractical: IScheduleItemDAO;
  newTutor: IScheduleTutorDAO;

  constructor(props: IComponent) {
    super();

    this.newPractical = {
      from: null, due: null, practicalId: null, name: null
    };
    this.newTutor = { id: null, name: null, email: null };
  }

  handleTabChange(tabs: any[]) {
    let editorHolder = ReactDOM.findDOMNode<HTMLElement>(this.refs["editorHolder"]);
    if (editorHolder) {
      editorHolder.style.height = tabs.length === 0 ? "60px" : "400px";
    }
  }

  previewDescription() {
    const { Utils } = this.props.context();

    Utils.Ui.showMarkdownModal(this.props.schedule.description);
  }

  save() {
    const { Utils, ApplicationState } = this.props.context();
    this.props.schedule.save(Utils.Ui.announceSaved(ApplicationState.reset));
  }

  render() {
    const { Utils, ApplicationState } = this.props.context();
    const { schedule } = this.props;

    let practical: IScheduleItemDAO;
    let tutor: IScheduleTutorDAO;

    return (
      <div>
        <div className="ui breadcrumb">
          <a className="section" href={ Utils.Router.pathFor("schedules") }>{ mf("schedules.label") }</a>
          <i className="right right angle white white icon divider" />
          <div className="active section">{ schedule.name }</div>
        </div>

        <div className="ui segment form">
          <h2 className="ui header">
            <i className="calendar outline icon" />
            <div className="content">{schedule.name}</div>
          </h2>
          <div className="fields">
            <div className="twelve wide field">
              <label>{ mf("name") }</label>
              <input type="text"
                placeholder={ mf("schedule.name") }
                defaultValue={schedule.name}
                onChange={Utils.Binding.bind(this, "schedule.name") } ref="name" />
            </div>
            <div className="four wide field">
              <label>{ mf("startDate") }</label>
              <input type="text"
                placeholder={ mf("schedule.startDate") }
                className="form-control datepicker"
                defaultValue={Utils.Ui.niceDate(schedule.startDate) }
                ref="startDate" />
            </div>
          </div>
          <div className="field">
            <label>{ mf("description") }</label>
            <textarea placeholder={ mf("schedule.description") }
              defaultValue={this.props.schedule.description}
              onChange={Utils.Binding.bind(this, "schedule.description") }
              ref="scheduleDescription"></textarea>
          </div>
          <div className="ui default right floated labeled icon button" onClick={this.previewDescription.bind(this) }>
            <i className="icon search" /> { mf("preview") }
          </div>
          <div className="clear"></div>
        </div>
        <div className="ui top attached segment form">
          <h2>{ mf("schedule.practicals") }</h2>
          <div className="ui items">
            <div className="fields">
              <div className="two wide field">
                { mf("schedule.visibleFrom") }
              </div>
              <div className="two wide field">
                { mf("schedule.DueDate") }
              </div>
              <div className="nine wide field">
                { mf("practical.label") }
              </div>
              <div className="three wide field"></div>
            </div>
            <For each="practical" index="index" of={ this.props.practicals }>
              <SchedulePractical key={practical.practicalId}
                context={this.props.context}
                practical={practical}
                deletePractical={ this.props.deletePractical.bind(this, schedule, practical) } />
            </For>
          </div>
        </div>
        <div className="ui bottom attached segment form">
          <div className="fields">
            <div className="two wide field">
              <input type="text"
                placeholder={ mf("schedule.fromPlaceholder") }
                className="form-control datepicker"
                ref="addFrom" />
            </div>
            <div className="two wide field">
              <input type="text"
                placeholder={ mf("schedule.duePlaceholder") }
                className="form-control datepicker"
                ref="addDue" />
            </div>
            <div className="ui fluid search nine wide field searchPractical">
              <input id="searchPracticalInput" type="text" className="prompt" placeholder={ mf("practical.search") } ref="practical" />
              <div className="results" />
            </div>
            <div className="three wide field">
              <div className="ui fluid default icon labeled button" onClick={this.props.addPractical.bind(this, schedule, this.newPractical) }>
                <i className="plus icon" /> { mf("schedule.addPractical") }
              </div>
            </div>
          </div>
        </div>
        <div className="ui segment form">
          <h2>{ mf("tutors.label") }</h2>
          <div className="ui items">
            <For each="tutor" index="index" of={this.props.schedule.tutors}>
              <ScheduleTutor key={tutor.id} tutor={tutor} deleteTutor={this.props.deleteTutor.bind(this, schedule, tutor) } />
            </For>
          </div>
          <div className="fields">
            <div className="thirteen wide field">
              <div className="ui icon input search searchTutor">
                <input type="email" placeholder={ mf("tutor.email") } className="prompt" id="tutorEmail" />
                <i className="mail icon" />
                <div className="results" />
              </div>
            </div>
            <div className="three wide field">
              <div className="ui fluid default icon labeled button" onClick={this.props.addTutor.bind(this, schedule, this.newTutor) }>
                <i className="plus icon" /> { mf("schedule.addTutor") }
              </div>
            </div>
          </div>
        </div>
        {/* FILES */}
        <div className="whiteEditor"
          ref="editorHolder"
          style={{ height: this.props.schedule.files.length > 0 ? 400 : 60, position: "relative" }}>
          <TabbedTextEditor
            context={this.props.context}
            canModify={true}
            background="blackBackground"
            allowEditLibraries={true}
            hideLibraries={false}
            onTabsChanged={this.handleTabChange.bind(this)}
            files={this.props.schedule.files} />
        </div>
        <div className="ui form segment">
          <h2>{ mf("permissions.label") }</h2>
          <PermissionAdmin permissions={this.props.schedule.permissions} />
        </div>
        <div className="ui left floated red icon labeled button" onClick={this.props.delete.bind(this, schedule) }>
          <i className="trash icon" /> { mf("delete") }
        </div>
        <div className="ui right floated primary submit icon labeled button save" onClick={this.save.bind(this) }>
          <i className="save icon" /> { mf("save") }
        </div>
        <div className="ui right floated default icon labeled button" onClick={this.props.duplicate.bind(this, schedule) }>
          <i className="copy icon" /> { mf("duplicate") }
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { Utils, Collections } = this.props.context();

    Utils.Ui.registerSaveListener(this);
    Utils.Ui.datePicker(ReactDOM.findDOMNode(this.refs["startDate"]), this.props.schedule, "startDate");
    Utils.Ui.datePicker(ReactDOM.findDOMNode(this.refs["addFrom"]), this.newPractical, "from");
    Utils.Ui.datePicker(ReactDOM.findDOMNode(this.refs["addDue"]), this.newPractical, "due");

    let self = this;
    let pracs = Collections.Practicals.find({}, { reactive: false });
    if (pracs.count()) {
      let values = pracs.map(
        function(p: IPracticalDAO) {
          return {
            title: p.name,
            description: Utils.Ui.previewMarkdown(p.description, 200),
            _id: p._id
          };
        }
      );
      $("#searchPracticalInput").change(() => self.newPractical.name = $("#searchPracticalInput").val());
      $(".searchPractical").search({
        source: values,
        onSelect(result: { title: string, description: string, _id: string }, response: Object) {
          self.newPractical.practicalId = result._id;
          self.newPractical.name = result.title;
        }
      });
    }

    $(".searchTutor").search({
      apiSettings: {
        url: "/api/search/users?who={query}"
      },
      onSelect(result: { title: string, description: string, _id: string }, response: Object) {
        self.newTutor.id = result._id;
        self.newTutor.name = result.description;
        self.newTutor.email = result.title;
      },
      type: "standard"
    });
  }
}


//////////////////////////////////////////////////////////////////////////////
// SchedulePractical Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface ISchedulePracticalProps {
  key?: string;
  practical: IScheduleItemDAO;
  deletePractical: (practical: IScheduleItemDAO) => void;
  context: () => IContext;
}

interface ISchedulePracticalState {
  bar: string;
}

class SchedulePractical extends React.Component<ISchedulePracticalProps, {}> {
  render() {
    const { Utils } = this.props.context();

    return <div className="fields">
      <div className="two wide field">
        <input type="text"
          placeholder={ mf("schedule.fromPlaceholder") }
          ref="fromDate"
          className="form-control datepicker"
          defaultValue={ Utils.Ui.niceDate(this.props.practical.from) } />
      </div>
      <div className="two wide field">
        <input type="text"
          placeholder={ mf("schedule.duePlaceholder") }
          ref="dueDate"
          className="form-control datepicker"
          defaultValue={ Utils.Ui.niceDate(this.props.practical.due) }
          onChange={() => alert("chage") }
          onInput={() => alert("chage") } />
      </div>
      <div className="nine wide field centered">
        <label style={{ marginTop: 10 }}><a href={ Utils.Router.pathFor("adminPractical", {
          _id: this.props.practical.practicalId,
          name: Utils.Router.encodeUrlName(this.props.practical.name)
        }) }>{ this.props.practical.name}</a></label>
      </div>
      <div className="three wide field">
        <div className="ui fluid red icon labeled button"
          onClick={this.props.deletePractical.bind(this, this.props.practical) }>
          <i className="trash icon" /> { mf("remove") }
        </div>
      </div>
    </div>;
  }

  componentDidMount() {
    const { Utils } = this.props.context();

    Utils.Ui.datePicker(ReactDOM.findDOMNode(this.refs["fromDate"]), this.props.practical, "from");
    Utils.Ui.datePicker(ReactDOM.findDOMNode(this.refs["dueDate"]), this.props.practical, "due");
  }
}

//////////////////////////////////////////////////////////////////////////////
// ScheduleTutor Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IScheduleTutorProps {
  key?: string;
  tutor: IScheduleTutorDAO;
  deleteTutor: (tutor: IScheduleTutorDAO) => void;
}

interface IScheduleTutorState {
  bar: string;
}

class ScheduleTutor extends React.Component<IScheduleTutorProps, {}> {
  render() {
    return (
      <div className="fields">
        <div className="thirteen centered wide field">
          <input type="text" disabled={true} defaultValue={ this.props.tutor.name + " <" + this.props.tutor.email + ">"} />
        </div>
        <div className="three wide field">
          <div className="ui fluid red icon labeled button removeTutor"
            onClick={this.props.deleteTutor.bind(this, this.props.tutor) }>
            <i className="trash icon" /> { mf("remove") }
          </div>
        </div>
      </div>
    );

  }
}
