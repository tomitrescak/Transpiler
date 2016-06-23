import React from "react";



interface ILeaderboardsResultsProps {
  results: IResultsDAO[];
  limit?: number;
}

export function scheduleLeaderboardsRoute(context: IContext, schedule: IScheduleDAO) {
  return context.Utils.Router.pathFor("scheduleLeaderboards", {
    _id: schedule._id,
    name: context.Utils.String.encodeUrlName(schedule.name)
  });
}

export function practicalLeaderboardsRoute(context: IContext, schedule: IScheduleDAO, practical: IPracticalDAO) {
  return context.Utils.Router.pathFor("practicalLeaderboards", {
    scheduleId: schedule._id,
    scheduleName: context.Utils.Router.encodeUrlName(schedule.name),
    practicalId: practical._id,
    practicalName: context.Utils.String.encodeUrlName(practical.name)
  });
}

export function exerciseLeaderboardsRoute(context: IContext, schedule: IScheduleDAO, practical: IPracticalDAO, exercise: IExerciseDAO) {
  return context.Utils.Router.pathFor("exerciseLeaderboards", {
    scheduleId: schedule._id,
    scheduleName: context.Utils.Router.encodeUrlName(schedule.name),
    practicalId: practical._id,
    practicalName: context.Utils.Router.encodeUrlName(practical.name),
    exerciseId: exercise._id,
    exerciseName: context.Utils.Router.encodeUrlName(exercise.name)
  });
}

export default class LeaderboardsResults extends React.Component<ILeaderboardsResultsProps, {}> {

  sortedResults(): IResultsDAO[] {
    // if there is only one element make it number one
    if (this.props.results.length === 0) {
      return [];
    }

    let results = this.props.results;

    // sort array by ranking
    results.sort((a: IResultsDAO, b: IResultsDAO): number => {
      return a.locRank < b.locRank ? -1 : (a.locRank > b.locRank ? 1 : (b.stepsRank - a.stepsRank));
    });

    // now assign indexes, assigning same ranking with people with same rank
    let rank = 1;
    results[0].rank = 1;
    results[0].locRank = parseFloat(results[0].locRank.toFixed(3));

    for (let i = 1; i < results.length; i++) {
      // round value
      results[i].locRank = parseFloat(results[i].locRank.toFixed(3));

      // advance rank if next record is worse
      if (results[i - 1].locRank < results[i].locRank || results[i - 1].stepsRank < results[i].stepsRank) {
        rank++;
      }

      results[i].rank = rank;
    }

    if (this.props.limit) {
      return results.splice(0, this.props.limit);
    }
    return results;
  }

  render() {
    let result: IResultsDAO;
    const sortedResults = this.sortedResults();

    return (
      <table className="ui bottom attached table" style={{ marginTop: "-4px" }}>
        <thead>
          <tr>
            <th>{ mf("results.position") }</th>
            <th>{ mf("results.name") }</th>
            <th>{ mf("results.solutions") }</th>
            <th>{ mf("results.loc") }</th>
            <th>{ mf("results.steps") }</th>
            <th>{ mf("results.lsrank") }</th>
          </tr>
        </thead>
        <tbody>
          <For each="result" index="index" of={sortedResults}>
            <tr key={result._id}>
              <td>{ result.rank }</td>
              <td>{ result.userName }</td>
              <td>{ result.completed }</td>
              <td>{ result.loc }</td>
              <td>{ result.steps }</td>
              <td>{ result.locRank }</td>
            </tr>
          </For>
        </tbody>
      </table>
    );
  }
}
