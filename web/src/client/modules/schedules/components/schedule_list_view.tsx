import * as React from 'react';
import { Segment, Header2, Text, Button } from 'semanticui-react';

// import SearchBar from '../../core/components/search_bar_view';
// import Badges from '../../badges/containers/badges_container';

//////////////////////////////////////////////////////////////////////////////
// ScheduleItem Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface IScheduleItemProps extends IScheduleDAO {
  key: string;
  route: string;
  context: IContext;
}

const ScheduleItem = ({ name, _id, route, context, startDate, description }: IScheduleItemProps) => {
  const { Utils } = context;
  return (
    <Header2 icon="calendar outline">
      <a href={`${route}/${name}/${_id}`}>{name}</a>
      <div className="sub header">
        <If condition={startDate}>
          <span><Text text="startDate" />: {Utils.Ui.niceDate(startDate) } {"\u00B7"}</span>
        </If>
        { description }
      </div>
    </Header2>
  );
};

///////////////////////////////////////////////////////////////////////////
// SchedulesView Component                                               //
///////////////////////////////////////////////////////////////////////////

export interface IComponentProps {
  schedules: IScheduleDAO[];
  header: string;
  icon: string;
  route: string;
  showBadges: boolean;
  isAdmin: boolean;
}

export interface IComponentActions {
  create: () => void;
  handleSearch: (text: string) => void;
  clearSearch: () => void;
  context: () => IContext;
}

export interface IPropsAll extends IComponentProps, IComponentActions { }

const SchedulesView = ({ context, icon, header, schedules, route, isAdmin, create }: IPropsAll) => {
  let schedule: IScheduleDAO;
  return (
    <span>
      <Segment attached="top" classes="form">
        <Header2 icon={icon} text={header}/>
        {/*<SearchBar placeHolder="schedule.search" onUserInput={handleSearch.bind(this) } />*/}
      </Segment>

      <If condition={schedules.length > 0}>
        <div style={{ marginTop: -2 }}>
          <For each="schedule" index="index" of={schedules}>
            <Segment key={schedule._id} attached="middle" style={{ borderTop: '0px' }}>
              <ScheduleItem key={schedule._id} {...schedule} route={route} context={context() } />
              {/*{ showBadges ? <Badges scheduleId={schedule._id} /> : '' }*/}
            </Segment>
          </For>
        </div>
        <Else />
        <If condition={isAdmin }>
          <Segment attached="bottom">
            <Button color="primary" labeled="left" icon="plus" text="schedule.add" onClick={create.bind(this) } />
            <Text text="confirm.createSchedule" />
          </Segment>
          <Else />
          <Segment attached="bottom">
            <Text text="search.empty" />
          </Segment>
        </If>
      </If>
    </span>
  );
}


export default SchedulesView;
