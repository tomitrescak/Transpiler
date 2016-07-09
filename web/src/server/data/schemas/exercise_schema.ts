import { Exercises } from '../../../lib/collections/collections';
import Permission from '../../../lib/models/permission_model';

const schema = `
  type LinesOfCode {
    cheatDetection: Int
    oneStar: Int
    twoStars: Int
    threeStars: Int
  }

  type BoardValidation {
    boards: [Board]
    input: [String]
    output: [String]
    checkPosition: Boolean
  }

  type StepsStars {
    oneStar: Int
    twoStars: Int
  }

  type Board {
    validations: [BoardValidation]
    rows: Int
    columns: Int
    worldId: String
    stars: StepsStars
    wrap: Boolean
    tiles: [[Int]]
  }

  type Exercise {
    _id: String
    name: String
    description: String
    points: Float
    difficulty: Int
    linesOfCode: LinesOfCode
    worldId: String
    image: String
    allowedCommands: String
    files: [TextFile]
    boards: [Board]
    images: [String]
    permissions: Permissions
    protectLoops: Boolean
    createdAt: Date
    createdBy: String
    createdById: String
    updatedAt: Date
    updatedBy: String
    updatedById: String
  }
`;

const queryText = `
  exercise(id: String, userId: String): Exercise
`;

const queries = {
  exercise(root: any, { id }: any, { user }: IApolloContext): IExerciseDAO {
    const permissionQuery = Permission.permissionQuery(user);
    permissionQuery._id = id;
    return Exercises.findOne(permissionQuery);
  }
}

const resolvers = {
  BoardValidation: {
    boards(boardValidation: IBoardValidationDAO) {
      return boardValidation.boards;
    }
  },
  Board: {
    validations(board: IBoardDAO) {
      return board.validations;
    },
    stars(board: IBoardDAO) {
      return board.stars;
    }
  },
  Exercise: {
    linesOfCode(exercise: IExerciseDAO) {
      return exercise.linesOfCode;
    },
    files(exercise: IExerciseDAO) {
      return exercise.files;
    },
    boards(exercise: IExerciseDAO) {
      return exercise.boards;
    },
    permissions(exercise: IExerciseDAO) {
      return exercise.permissions;
    }
  }
};

export default {
  schema,
  resolvers,
  queryText,
  queries
};
