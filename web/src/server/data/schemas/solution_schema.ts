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
}

export default {
  schema,
  resolvers
}
