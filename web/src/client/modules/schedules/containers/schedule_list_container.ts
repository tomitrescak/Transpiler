import { Meteor } from 'meteor/meteor';
import { useDeps, compose, composeAll } from 'mantra-core';
import Component, { IComponentProps, IComponentActions } from '../components/schedule_list_view';
import Loading from '../../core/components/loading_view';
import { connect } from 'react-apollo';
import apolloContainer from '../../core/containers/apollo_container';

interface IProps {
  context?: () => IContext;
  clearSearch?: Function;
  header: string;
  route: string;
  showBadges: boolean;
  icon: string;
}

// export const composer: IKomposer = ({context, clearSearch, header, route, showBadges, icon}: IProps, onData: IKomposerData<IComponentProps>) => {
//   const { Sub, Collections, Models, LocalState }: IContext = context();
//   if (Sub.subscribe('schedules').ready()) {
//     const options = {
//       reactive: false,
//       sort: {startDate: -1}
//     };
//
//     const searchText = LocalState.get(LocalState.keys.Search);
//
//     let reg = searchText ? new RegExp('.*' + searchText + '.*', 'i') : /.*/;
//     let data = Collections.Schedules.find({ name: { $regex: reg } }, options).fetch();
//
//     // build all schedules
//
//     const componentData = {
//       header,
//       route,
//       showBadges,
//       icon,
//       isAdmin: Models.Security.isAdmin(Meteor.userId()),
//       schedules: data
//     };
//     onData(null, componentData);
//   } else {
//     onData();
//   }
//   return clearSearch;
// };

const mapQueriesToProps = (): IGraphqlQuery => {
  return {
    data: {
      query: gql`
      {
        schedules {
          _id
          name
          description
          startDate
          totalExercises
        }
      }`,
    }
  };
};

export const mapStateToProps = (state: IState, ownProps: IProps) => {
  // const filter = state.schedules.filter;
  let schedules = ownProps.data.schedules;

  // if (filter) {
  //   const reg = new RegExp('.*' + filter + '.*', 'i');
  //   schedules = schedules.filter((s: IScheduleDAO) => s.name.match(reg));
  // }

  return {
    schedules
  }
};

export const depsMapper = (context: IContext, actions: { schedule: IComponentActions }): IComponentActions => ({
  create: actions.schedule.create,
  clearSearch: actions.schedule.clearSearch,
  handleSearch: actions.schedule.handleSearch,
  context: () => context
});

export default composeAll<IProps>(
  compose(apolloContainer(), Loading),
  connect({ mapQueriesToProps }),
  useDeps()
)(Component);
