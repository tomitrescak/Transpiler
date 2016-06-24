import React from 'react';

import { Meteor } from 'meteor/meteor';
import { Breadcrumbs, Breadcrumb, Segment, Header2, Button, Items } from 'semanticui-react';

import PracticalItem from '../../practicals/components/practical_item_view';
import ScheduleSubscription from '../containers/schedule_subscription_container';

//////////////////////////////////////////////////////////////////////////////
// ScheduleView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IProps extends IComponentProps {
  data: { schedule: IScheduleDAO };
  visibleItems: IScheduleItemDAO[];
}

export interface IComponentProps {
  context: IContext;
  user: SystemUser;
}

const renderPracticalItem = (item: IScheduleItemDAO, schedule: IScheduleDAO, context: IContext, user: SystemUser) => {
  const practical = schedule.practicals.find((p) => p._id === item.practicalId);
  if (practical) {
    const today = new Date();
    const isVisible = item.from <= today;

    return <PracticalItem key={practical._id}
              scheduleId={schedule._id}
              scheduleName={schedule.name}
              practical={practical}
              isVisible={isVisible}
              canWrite={user ? user.canWrite(practical.permissions) : false}
              context={context}
              isAdmin={user ? user.isAdmin() : false}
      />;
  }
};

const ScheduleView = ({ context, data, user }: IProps) => {
  const { schedule } = data;
  const { name, _id, description } = schedule;
  let item: IScheduleItemDAO;

  // filter visible items
  let visibleItems: any[] = null;
  if (user && user.isAdmin()) {
    visibleItems = schedule.items;
  } else {
    const date = new Date();
    visibleItems = schedule.items.filter((doc: IScheduleItemDAO) => { return doc.from == null || doc.from < date; });
  }

  return (
    <div>
      <Breadcrumbs divider=">">
        <Breadcrumb link="/schedules" text="schedules.label" />
        <Breadcrumb>{name}</Breadcrumb>
      </Breadcrumbs>

      <Segment attached="top">
        <Header2 icon="archive">
          <If condition={user && user.isAdmin()}>
            <Button url={`admin/schedule/${_id}/${context.Utils.Router.encodeUrlName(name)}`} icon="edit" labeled="left" color="orange" classes="right floated" text="modify" />
          </If>
          {/*<If condition={Security.isTutor()}>
                            <a href={ Utils.Router.pathFor('adminSchedule', {
                                        _id: _id,
                                        name: Utils.Router.encodeUrlName(name)})}
                               className="ui right floated labeled default icon button">
                               <i className="users icon" /> { mf('users') }
                            </a>
                        </If>*/}
          <Button url={`leaderboards/schedule/${context.Utils.Router.encodeUrlName(name)}/${_id}`}
            icon="trophy" color="green" classes="right floated" />
          { name }
          <div className="sub header">{description}</div>
        </Header2>
        <Items>
          <For each="item" index="index" of={visibleItems}>
            { renderPracticalItem(item, schedule, context, user) }
          </For>
        </Items>
      </Segment>
      <If condition={schedule.tutors.length > 0}>
        <Segment attached="bottom">
          <div style={{ textAlign: 'right' }}>
            <If condition={user}>
              <ScheduleSubscription scheduleId={_id} tutors={schedule.tutors} />
            </If>
          </div>
        </Segment>
      </If>
    </div>
  );
};

export default ScheduleView;
