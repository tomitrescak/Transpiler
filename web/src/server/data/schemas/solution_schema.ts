import { Solutions } from '../../../lib/collections/solution_collection';
import { playsRoles } from '../../../lib/helpers/data_helpers';

const schema = `
  type Submission {
    date: Date
    files: [TextFile]
  }

  type Solution {
    _id: String
    scheduleId: String
    practicalId: String
    exerciseId: String
    tutorId: String
    tutorName: String
    files: [TextFile]
    status: String
    validated: Boolean
    comments: [Comment]
    codeStars: Int
    linesOfCode: Int
    steps: Int
    stepsStars: Int
    mark: Float
    rank: Int
    locRank: Int
    stepsRank: Int
    submission: Submission
    createdAt: Date
    createdBy: String
    createdById: String
    updatedAt: Date
    updatedBy: String
    updatedById: String
  }
`;

const resolvers = {
  Solution: {
    submission(solution: ISolutionDAO) {
      return solution.submission;
    },
    files(solution: ISolutionDAO) {
      return solution.files;
    },
    comments(solution: ISolutionDAO) {
      return solution.comments;
    },
  },
  Submission: {
    files(submission: ISubmissionDAO) {
      return submission.files;
    }
  }
};

const queryText = `
  solution(scheduleId: String, practicalId: String, exerciseId: String, userId: String): Solution
`;

const queries = {
  solution(root: any, { scheduleId, practicalId, exerciseId, userId }: any, { user }: IApolloContext): ISolutionDAO {
    if (playsRoles, ['admin', 'tutor']) {
      // admin or tutor possibly view their own solutions
      userId = userId ? userId : user._id;
    } else {
      // non admins and tutors are bound to see their own solutions
      userId = user._id;
    }

    return Solutions.findOne({
      scheduleId: scheduleId,
      practicalId: practicalId,
      exerciseId: exerciseId,
      createdById: userId
    });
  }
};

const mutationText = `
  changeSolutionState(id: String, status: String): Boolean
`;

interface MutationSubscribe {
  id: string;
  status: string;
}

const statuses = ['', 'Open', 'Submitted', 'Marked'];

const mutations = {
  changeSolutionState(root: any, { id, status }: MutationSubscribe, { userId }: IApolloContext) {
    if (statuses.indexOf(status) === -1) {
      throw new Error('Status does not exist: ' + status);
    }
    const options = { status };

    // submitted solutions are kept separately from main files
    if (status === 'Submitted') {
      const solution = Solutions.findOne(id);
      options['submission'] = {
        date: new Date(),
        files: solution.files
      };
    } else if (status !== 'Marked') {
      options['submission'] = null;
    }

    Solutions.update({ _id: id, updatedById: userId }, { $set: options });

    return true;
  }
};

export default {
  schema,
  resolvers,
  mutationText,
  mutations,
  queryText,
  queries
};
