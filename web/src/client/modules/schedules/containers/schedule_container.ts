import Component, { IComponentProps } from '../components/schedule_view';
import { connect, loadingContainer } from 'meteor/tomi:apollo-mantra';

interface IProps {
  params: {
    id: string;
  };
}

const mapQueriesToProps = (context: IContext, { state, ownProps }: IGraphQlProps<IProps>): IGraphqlQuery => {
  return {
    data: {
      query: gql`
      query schedule($id: String, $userId: String) {
        schedule(id: $id, userId: $userId) {
          _id
          name
          description
          startDate
          totalExercises,
          items {
            from
            due
            practicalId
            name
          }
          tutors {
            id
            name
            email
          }
          practicals {
            _id
            name
            image
            description
            createdBy
            updatedAt
            permissions {
              owner
              ownerAccess
              otherAccess
            }
          }
        }
      }`,
      variables: {
        id: ownProps.params.id,
        userId: state.accounts.userId
      },
    }
  };
};

export const mapStateToProps = (context: IContext, state: IState, ownProps: IProps): IComponentProps => ({
  context,
  user: state.accounts.user
});


export default connect({ mapQueriesToProps, mapStateToProps })(loadingContainer(Component));


// export const composer: IKomposer = ({context, scheduleId}: IProps, onData: IKomposerData<IComponentProps>) => {
//   const { Sub, Utils, Collections, User }: IContext = context();
//
//   let handle1 = Sub.subscribe('schedule', scheduleId);
//   let handle2 = Sub.subscribe('scheduledPracticals', Utils.Router.getParam('_id'));
//
//   if (handle1.ready() && handle2.ready()) {
//     let schedule = Collections.Schedules.findOne(scheduleId, { reactive: false });
//     // figure out which items are visible
//
//     let visibleItems: IScheduleItemDAO[] = [];
//     let date = new Date();
//     let item: IScheduleItemDAO;
//
//     if (User.info().playsRoles(['admin', 'tutor'])) {
//       visibleItems = schedule.items;
//     } else {
//       visibleItems = schedule.items.filter((doc: IScheduleItemDAO) => { return doc.from == null || doc.from < date; });
//     }
//
//     let data: IComponentProps = {
//       schedule,
//       visibleItems,
//       context
//     };
//     onData(null, data);
//   } else {
//     onData();
//   }
//   return null;
// };
//
//
// export default composeAll<IProps>(
//   composeWithTracker(composer, Loading),
//   useDeps()
// )(Component);
