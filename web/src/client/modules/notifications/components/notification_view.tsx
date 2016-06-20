import React from 'react';

import NotificationManager from '../../../../lib/models/notification_manager';
import { UiUtils } from '../../../utils/helpers_client';
import { Schedules } from '../../../../lib/collections/schedules_collection';

import { Text } from 'semanticui-react';
import { mf } from '../../../configs/i18n';

//////////////////////////////////////////////////////////////////////////////
// NotificationsView Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface INotificationsViewProps {
  notifications: INotificationDAO[];
}

class NotificationsView extends React.Component<INotificationsViewProps, {}> {
  schedules: {};

  scheduleName(id: string) {
    if (this.schedules == null) {
      this.schedules = {};
    }
    if (this.schedules[id] == null) {
      let schedule = Schedules.findOne(id);
      this.schedules[id] = schedule ? schedule.name : '';
    }
    return this.schedules[id];
  }

  notificationImage(code: string, parameters: any) {
    let codes = NotificationManager.codes;
    let src = '';
    switch (code) {
      case codes.speedAchievement:
        src = 'Speed' + (6 - parameters.rank);
        break;
      case codes.locAchievement:
        src = 'Loc';
        break;
      case codes.locMasterAchievement:
        src = 'Loc' + (parameters.rank);
        break;
      case codes.stepsAchievement:
        src = 'Steps';
        break;
      case codes.stepsMasterAchievement:
        src = 'Steps' + (parameters.rank);
        break;
      case codes.bestExercise:
        src = 'Exercise' + (6 - parameters.rank);
        break;
      case codes.bestPractical:
        src = 'Practical' + (6 - parameters.rank);
        break;
      case codes.bestSchedule:
        src = 'Schedule' + (6 - parameters.rank);
        break;
      case codes.dropBestExercise:
      case codes.dropBestPractical:
      case codes.dropBestSchedule:
      case codes.noBestExercise:
      case codes.noBestPractical:
      case codes.noBestSchedule:
        src = 'drop';
        break;
      case codes.marked:
      case codes.markRemoved:
        src = 'mark';
        break;
    }
    return '/images/badges/' + src + '.png';
  }

  render() {
    if (!this.props.notifications) {
      return <span>"Loading"</span>;
    }
    let notifications: any[] = [];

    this.props.notifications.map((notification: INotificationDAO) => {
      notifications.push(<div key={notification._id} className="event">
        <div className="label">
          <img src={this.notificationImage(notification.code, notification.parameters) } />
        </div>
        <div className="content">
          <div className="date">
            { UiUtils.relativeDate(notification.date) } · { this.scheduleName(notification.scheduleId) }
          </div>
          <div className="summary">
            { mf(notification.code, notification.parameters) }
          </div>
        </div>
      </div>);
    });

    return <div className="ui feed">
      { this.props.notifications.length === 0 ? mf('noNotifications') : notifications }
    </div>;
  }
}

export default NotificationsView;
