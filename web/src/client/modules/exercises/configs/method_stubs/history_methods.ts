import MeteorMethod from "../../../../../common/models/meteor_method_model";
import { check } from "meteor/check";

export let getCodeHistory = new MeteorMethod<string, void>("getCodeHistory");

export default function({Meteor}) {
  Meteor.methods({
    getCodeHistory: (solutionId: string) => {
      check(solutionId, String);
      return <any>[];
    }
  });
}
