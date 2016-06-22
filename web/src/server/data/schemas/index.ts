import { processSchema } from 'meteor/tomi:apollo-mantra';

// process all

import achievements from './achievements_schema';
import common from './common_schema';
import date from './date_schema';
import exercise from './exercise_schema';
import notifications from './notifications_schema';
import permissions from './permission_schema';
import practicals from './practical_schema';
import schedule from './schedule_schema';
import root from './root_schema';
import user from './user_schema';

export default function() {
  processSchema([
    achievements,
    common,
    date,
    exercise,
    notifications,
    permissions,
    practicals,
    schedule,
    root,
    user
  ]);
}
