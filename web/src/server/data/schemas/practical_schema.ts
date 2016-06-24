import { Practicals, Exercises, Solutions } from '../../../lib/collections/collections';
import { isAdmin } from '../../../lib/helpers/data_helpers';
import Permission from '../../../lib/models/permission_model';

const schema = `
  type Practical {
    _id: String
    createdAt: Date
    createdBy: String
    createdById: String
    updatedAt: Date
    updatedBy: String
    updatedById: String
    name: String
    image: String
    description: String
    lecture: String
    files: [TextFile]
    exercises: [Exercise]
    ratedExercises: Int
    permissions: Permissions
  }
`;

const queryText = `
  practical(practicalId: String, scheduleId: String, userId: String): Practical
`;

const queries = {
  practical(root: any, { practicalId, scheduleId }: any, { userId }: IApolloContext): IPracticalDAO {
    const practical = Practicals.findOne(practicalId);
    if (practical && scheduleId && userId) {
      // find all user solutions
      const solutions = Solutions.find(
        { practicalId: practicalId, scheduleId: scheduleId, createdById: userId },
        { fields: { status: 1, mark: 1, codeStars: 1, stepsStars: 1  }}).fetch();

      // assign solutions to the resulting exercises
      if (solutions.length > 0) {
        practical.exercises.forEach((e) => {
          e.solution = solutions.find((s) => s.exerciseId === e._id);
        });
      }
    }
    return practical;
  },
};

const resolvers = {
  Practical: {
    permissions(schedule: IPracticalDAO) {
      return schedule.permissions;
    },
    files(schedule: IPracticalDAO) {
      return schedule.files;
    },
    exercises(schedule: IPracticalDAO, params: any, { user }: IApolloContext) {
      // initialise a user access based query
      let query = Permission.permissionQuery(user);

      // limit ids
      query._id = { $in: schedule.exercises };

      // find limited exercises
      return Exercises.find(query, { fields: { _id: 1, name: 1, description: 1 }}).fetch();
    }
  }
};

export default {
  schema,
  resolvers,
  queryText,
  queries
};