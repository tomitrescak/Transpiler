import { processSchema } from 'apollo-mantra';

// process all

import date from './date_schema';
import achievements from './achievements_schema';
import notifications from './notifications_schema';
import common from './common_schema';
import permissions from './permission_schema';
import schedule from './schedule_schema';
import root from './root_schema';

export default function() {
  processSchema([
    date,
    achievements,
    notifications,
    common,
    permissions,
    schedule,
    root
  ]);
}
