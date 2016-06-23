import * as Methods from "../../../../../common/methods/solution_methods";
import { Solutions } from "../../../../../common/collections";
import { UnauthorisedException } from "../../../../../common/models/exception_model";

import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export default function({Meteor}) {
  Meteor.methods({
    updateResults: function(args: Methods.IUpdateResultsParams) {
      // results are updated on server and not visualised on client, latancy compensation not needed
    },
    insertComment: function(args: Methods.IAddCommentParams): ICommentDAO {
      check(args, {
        solutionId: String,
        text: String
      });

      let user = Meteor.user();
      if (!user) {
        throw new UnauthorisedException(this);
      };

      let id = new Mongo.ObjectID()._str;
      let comment = {
        id: id,
        message: args.text,
        senderName: user.profile.name,
        senderId: user._id,
        senderAvatar: user.profile.avatar,
        sent: new Date()
      };

      Solutions.update({ _id: args.solutionId }, {
        $push: {
          comments: comment
        }
      });
      return comment;
    }
  });
}
