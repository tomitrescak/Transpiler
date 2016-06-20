import { Meteor } from "meteor/meteor";
import Practical from "../../../models/practical_model";
import Schedule from "../../../models/schedule_model";
import { addTutorToSchedule } from "../configs/method_stubs/schedules";

export class Actions {
  addPractical = (context: IContext, schedule: Schedule, practical: IScheduleItemDAO) => {
    const { Collections, Utils } = context;
    if (!practical.name) {
      Utils.Ui.alertDialog("error", "practical.practicalNotSpecified");
      return;
    }

    let prac = Collections.Practicals.findOne({ name: practical.name });

    // we may wish to create a new practical
    if (prac == null) {
      Utils.Ui.confirmDialog("confirm.createPractical", () => {
        // "Exercise does not exist, do you want to create a new exercise?"
        let that = this;
        let practicalModel = new Practical(context.Collections);
        practicalModel.name = practical.name;
        practicalModel.save(Utils.Ui.announceCreated((error: Meteor.Error, id: string) => {
          if (!error) {
            let newItem = {
              name: practical.name,
              practicalId: id,
              from: practical.from,
              due: practical.due
            };

            schedule.addPractical(newItem, Utils.Ui.announceSaved((err: Meteor.Error) => {
              if (!err) {
                Utils.Router.go("adminPractical", { _id: id, name: Utils.Router.encodeUrlName(practical.name) });
              }
            }));
          }
        }));


      }, "areYouSure", "create", "warning", true);
    } else {
      schedule.addPractical(practical);
    }
  };

  addTutor = ({ Utils }: IContext, schedule: Schedule, tutor: IScheduleTutorDAO) => {
    if (!tutor.email) {
      alert(mf("error.emailEmpty"));
      return;
    }
    // add locally
    schedule.addTutor(tutor.name, tutor.email, tutor.id);

    // add on server
    addTutorToSchedule.call({ scheduleId: schedule._id, tutorId: tutor.id }, (err: any, result: any) => {
      if (result) {
        Utils.Ui.alert("tutorCreated");
      }
    });
  };

  // @MeteorTemplate.event("click #deleteButton")
  delete = ({ Utils, FlowRouter }: IContext, schedule: Schedule) => {
    Utils.Ui.confirmDialog("confirm.delete", () => {
      schedule.delete(Utils.Ui.announceDeleted(() => {
        FlowRouter.go("schedules");
      }));
    });
  };

  deletePractical = ({ Utils }: IContext, schedule: Schedule, practical: IScheduleItemDAO) => {
    Utils.Ui.confirmDialog("confirm.delete", () => {
      schedule.removePractical(practical.practicalId);
    });
  };

  deleteTutor = ({ Utils }: IContext, schedule: Schedule, tutor: IScheduleTutorDAO) => {
    Utils.Ui.confirmDialog("confirm.delete", () => {
      schedule.removeTutor(tutor.id);
    });
  };

  // @MeteorTemplate.event("click #duplicateButton")
  duplicate = ({ Utils, FlowRouter }: IContext, originalSchedule: Schedule) => {
    Utils.Ui.confirmDialog("confirm.duplicate", () => {
      let schedule = new Schedule(originalSchedule);
      schedule._id = null;
      schedule.name += "(Clone)";

      schedule.save(Utils.Ui.announceDuplicated((error: Meteor.Error) => {
        if (!error) {
          FlowRouter.go("adminSchedule", { _id: schedule._id, name: Utils.Router.encodeUrlName(schedule.name) });
        }
      }));
    }, "areYouSure", "duplicate", "info", true);
  };
}

​let actions = new Actions();
export default actions;
