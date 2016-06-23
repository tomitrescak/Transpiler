import { Practicals, Exercises } from '../../../lib/collections/collections';
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

      return Exercises.find(query).fetch();
    }
  }
};

export default {
  schema,
  resolvers
};
