import { AchievementType } from '../collections/achievements_collection';
import { Exercises } from '../collections/exercises_collection';
import { Solutions } from '../collections/solution_collection';
import Notifications from '../collections/notification_collection';

import { Meteor } from 'meteor/meteor';

export default class NotificationManager {
  static codes = {
    speedAchievement: 'SpeedAchievement',
    locAchievement: 'LocAchievement',
    locMasterAchievement: 'LocMasterAchievement',
    stepsAchievement: 'StepsAchievement',
    stepsMasterAchievement: 'StepsMasterAchievement',
    bestExercise: 'BestExerciseAchievement',
    dropBestExercise: 'DropBestExercise',
    noBestExercise: 'NoBestExercise',
    bestPractical: 'BestPracticalAchievement',
    dropBestPractical: 'DropBestPractical',
    noBestPractical: 'NoBestPractical',
    bestSchedule: 'BestScheduleAchievement',
    dropBestSchedule: 'DropBestSchedule',
    noBestSchedule: 'NoBestSchedule',
    marked: 'NotifyMarked',
    markRemoved: 'NotifyMarkRemoved',
  };

  static changeMark(mark: number, solutionId: string) {

    let code = (mark === -1) ? NotificationManager.codes.markRemoved : NotificationManager.codes.marked;
    let solution = Solutions.findOne(solutionId);
    let exercise = Exercises.findOne(solution.exerciseId);

    NotificationManager.upsertNotify(
      solution.scheduleId,
      solution.practicalId,
      solution.exerciseId,
      code,
      {
        mark: mark.toString(),
        exercise: exercise.name
      },
      solution.createdById
      );
  }

  static notifySpeedAchievement(userId: string, scheduleId: string, solutionId: string, rank: number, exercise: string) {
    NotificationManager.insertNotify(scheduleId, NotificationManager.codes.speedAchievement, {
      rank: rank,
      exerciseName: exercise,
      solutionId: solutionId
    }, userId);
  }

  static notifyLocAchievement(userId: string, scheduleId: string, count: number) {
    NotificationManager.insertNotify(scheduleId, NotificationManager.codes.locAchievement, {
      count: count
    }, userId);
  }

  static notifyLocMasterAchievement(userId: string, scheduleId: string, rank: number) {
    NotificationManager.insertNotify(scheduleId, NotificationManager.codes.locMasterAchievement, {
      rank: rank
    }, userId);
  }

  static notifyStepsAchievement(userId: string, scheduleId: string, count: number) {
    NotificationManager.insertNotify(scheduleId, NotificationManager.codes.stepsAchievement, {
      count: count
    }, userId);
  }

  static notifyStepsMasterAchievement(userId: string, scheduleId: string, rank: number) {
    NotificationManager.insertNotify(scheduleId, NotificationManager.codes.stepsMasterAchievement, {
      rank: rank
    }, userId);
  }



  static notifyBestAchievement(
    userId: string,
    scheduleId: string,
    scheduleName: string,
    practicalId: string,
    practicalName: string,
    exerciseId: string,
    exerciseName: string,
    achievementType: AchievementType,
    rank: number
    ) {
    let code: string;
    if (achievementType === AchievementType.BestExercise) {
      code = NotificationManager.codes.bestExercise;
    } else if (achievementType === AchievementType.BestPractical) {
      code = NotificationManager.codes.bestPractical;
    } else if (achievementType === AchievementType.BestSchedule) {
      code = NotificationManager.codes.bestSchedule;
    }

    NotificationManager.upsertNotify(scheduleId, practicalId, exerciseId, code, {
      scheduleName: scheduleName,
      practicalName: practicalName,
      exerciseName: exerciseName,
      rank: rank
    }, userId);
  }

  static notifyDropBestAchievement(
    eliminated: boolean,
    userId: string,
    scheduleId: string,
    scheduleName: string,
    practicalId: string,
    practicalName: string,
    exerciseId: string,
    exerciseName: string,
    achievementType: AchievementType,
    rank: number
    ) {
    let code: string;
    if (achievementType === AchievementType.BestExercise) {
      code = eliminated ? NotificationManager.codes.noBestExercise : NotificationManager.codes.dropBestExercise;
    } else if (achievementType === AchievementType.BestPractical) {
      code = eliminated ? NotificationManager.codes.noBestPractical : NotificationManager.codes.dropBestPractical;
    } else if (achievementType === AchievementType.BestSchedule) {
      code = eliminated ? NotificationManager.codes.noBestSchedule : NotificationManager.codes.dropBestSchedule;
    }

    NotificationManager.upsertNotify(scheduleId, practicalId, exerciseId, code, {
      scheduleName: scheduleName,
      practicalName: practicalName,
      exerciseName: exerciseName,
      rank: rank
    }, userId);
  }

  static insertNotify(scheduleId: string, code: string, parameters: Object, userId?: string) {
    Notifications.insert({
      userId: userId ? userId : Meteor.userId(),
      scheduleId: scheduleId,
      code: code,
      parameters: parameters,
      date: new Date()
    });
  }

  static upsertNotify(scheduleId: string, practicalId: string, exerciseId: string, code: string, parameters: Object, userId?: string) {
    Notifications.upsert({
      userId: userId ? userId : Meteor.userId(),
      scheduleId: scheduleId,
      practicalId: practicalId,
      exerciseId: exerciseId,
      code: code
    }, {
        $set: {
          parameters: parameters,
          date: new Date()
        }
      });
  }
}
