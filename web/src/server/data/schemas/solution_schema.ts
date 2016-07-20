import { Solutions, Exercises, Configuration } from '../../../lib/collections/collections';
import { playsRoles } from '../../../lib/helpers/data_helpers';
import { Random } from 'meteor/random';
import { Email } from 'meteor/email';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { encodeUrlName } from '../../../lib/string_helpers';

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
  solutionInsertComment(solutionId: String, comment: String): Comment
`;

interface MutationSubscribe {
  id: string;
  status: string;
}

interface MutationInsertComment {
  solutionId: string;
  comment: string;
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
  },
  solutionInsertComment(root: any, { solutionId, comment }: MutationInsertComment, { user }: IApolloContext) {
    if (!user) {
      throw new Error('Unauthorised!');
    };

    console.log('Commenting on: ' + solutionId);

    let commentId = Random.id();
    let commentObject = {
      id: commentId,
      message: comment,
      senderName: user.profile.name,
      senderId: user._id,
      senderAvatar: user.profile.avatar,
      sent: new Date()
    };

    Solutions.update({ _id: solutionId }, {
      $push: {
        comments: commentObject
      }
    });

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    // this.unblock();

    // check if is tutor or student sending the email
    let from = user.emails[0].address;
    let to = '';
    let url = '';
    let solution = Solutions.findOne(solutionId);
    let exercise = Exercises.findOne(solution.exerciseId);

    if (Roles.userIsInRole(user._id, ['tutor'])) {
      // get the userproblem which we are commenting on
      let userProblemUserId = solution.createdById;
      to = Meteor.users.findOne(userProblemUserId).emails[0].address;
      url = `/exercise/${encodeUrlName(exercise.name)}/${solution.exerciseId}/${solution.practicalId}/${solution.scheduleId}`;
    } else {
      to = Meteor.users.findOne(solution.tutorId).emails[0].address;
      url = `/exercise/${encodeUrlName(exercise.name)}/${solution.exerciseId}/${solution.practicalId}/${solution.scheduleId}/${user._id}`;
    }

    // create absolute url, remove first '/'
    if (url[0] === '/') {
      url = url.substring(1);
    }
    url = Meteor.absoluteUrl(url);

    let siteConfig = Configuration.findOne();
    let emailText = siteConfig.comments.body
      .replace('${url}', url)
      .replace('${text}', comment)
      .replace('${name}', user.profile.name)
      //.replace('${schedule}', schedule.name)
      //.replace('${practical}', practical.name)
      .replace('${exercise}', exercise.name);

    let subject = siteConfig.comments.subject
      .replace('${url}', url)
      .replace('${name}', user.profile.name)
      .replace('${text}', comment)
      //.replace('${schedule}', schedule.name)
      //.replace('${practical}', practical.name)
      .replace('${exercise}', exercise.name);

    console.log(`Sending mail from '${from}' to: '${to}'`);
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: emailText
    });


    return commentObject;
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
