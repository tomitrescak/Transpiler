import { Schedules, Achievements, Practicals } from '../../../lib/collections/collections';
import { isAdmin } from '../../../lib/helpers/data_helpers';
import Permission from '../../../lib/models/permission_model';
import Cache from '../cache';

const schema = `
  type ScheduleItem {
    from: Float
    due: Float
    practicalId: String
    name: String
  }

  type ScheduleTutor {
    id: String
    name: String
    email: String
  }

  type Schedule {
    _id: String
    name: String
    description: String
    startDate: Date
    items: [ScheduleItem]
    tutors: [ScheduleTutor]
    permissions: [Permissions]
    files: [TextFile]
    totalExercises: Int
    achievements: [Achievement]
    practicals: [Practical]
    createdAt: Date
    createdBy: String
    createdById: String
    updatedAt: Date
    updatedBy: String
    updatedById: String
  }
`;

const resolvers = {
  Schedule: {
    items(schedule: IScheduleDAO) {
      return schedule.items;
    },
    tutors(schedule: IScheduleDAO) {
      return schedule.tutors;
    },
    permissions(schedule: IScheduleDAO) {
      return schedule.permissions;
    },
    practicals(schedule: IScheduleDAO, params: any, { user }: IApolloContext) {
      let ids = schedule.items.map((doc: IScheduleItemDAO) => { return doc.practicalId; });

      // initialise a user access based query
      let query = Permission.permissionQuery(user);

      // limit ids
      query._id = { $in: ids };

      // perform search
      return Practicals.find(query).fetch();
    },
    files(schedule: IScheduleDAO) {
      return schedule.files;
    },
    achievements(schedule: IScheduleDAO, params: any, { userId }: IApolloContext) {
      return Achievements.find({ userId, scheduleId: schedule._id }).fetch();
    },
  }
};

const queryText = `
  schedules(userId: String): [Schedule]
  schedule(id: String, userId: String): Schedule
  scheduleByName(name: String, userId: String): Schedule
`;

const queries = {
  schedule(root: any, { id }: any): IScheduleDAO {
    return Cache.getFromCache('schedule_' + id, () => {
      return Schedules.findOne({ _id: id });
    });
  },
  scheduleByName(root: any, { name }: any, { user }: IApolloContext): IScheduleDAO {
    let query = Permission.permissionQuery(user);
    query.name = name;

    return Schedules.findOne(query);
  },
  schedules(root: any, params: any, { user }: IApolloContext): IScheduleDAO[] {
    if (isAdmin(user)) {
      return Cache.getFromCache('schedules_admin', () => {
        return Schedules.find().fetch();
      });
    }
    return Schedules.find(Permission.permissionQuery(user), { sort: { startDate: -1 } }).fetch();
  }
};

export default {
  schema,
  queries,
  queryText,
  resolvers
};
