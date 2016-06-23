import React from 'react';
import { Button, Dropdown, DropdownItem, Modal } from 'semanticui-react';
import { mf } from '../../../configs/i18n';

let tutor: IScheduleTutorDAO;
let index: number;

export interface IComponentProps {
  subscription: IScheduleSubscription;
  context: IContext;
  user: SystemUser;
  tutors?: IScheduleTutorDAO[];
  scheduleId?: string;
}

export interface IComponentActions {
  subscribe: (scheduleId: string, tutorId: string) => void;
  unsubscribe: (scheduleId: string) => void;

}

export interface IComponent extends IComponentProps, IComponentActions { }

export const ScheduleSubscription = ({ user, subscription, subscribe, unsubscribe, tutors }: IComponent) => (
  <If condition={user}>
    <div>
      <If condition={subscription}>
        <Button icon="trash" onClick={unsubscribe} color="default">{ mf('schedule.unsubscribeWith') } { subscription.tutorName }</Button>
      <Else />
        <Dropdown id="subscription" activation="click" defaultText="schedule.selectTutor" onChange={(value: string, text: string) => subscribe(value, text) }>
          <For each="tutor" of={tutors} index="index">
            <DropdownItem key={index} value={tutor.id}>{ tutor.name }</DropdownItem>
          </For>
        </Dropdown>
      </If>
    </div>
  </If>
);

//////////////////////////////////////////////////////////////////////////////
// TutorModal Component                                                      //
//////////////////////////////////////////////////////////////////////////////

export class TutorModal extends React.Component<IComponent, {}> {
  close() {
    $('#tutorModal').modal('hide');
  }

  render() {
    return (
      <Modal id="ssubscriptionModal" small header="selectTutor.header"
        neutralAction={() => $('#tutorModal').modal('hide') }
        neutralText="close"
        icon="close">
        <div style={{ textAlign: 'center' }}>
          <ScheduleSubscription {...this.props} />
        </div>
      </Modal>
    );
  }
}

export default ScheduleSubscription;
