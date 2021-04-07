// TODO: Move the scheduler to a separate service, using a separate DB
import Agenda from 'agenda';
import { Application } from '@feathersjs/express';
import {
  dailyOrderCountTask,
  dailyRevenueTask,
  dailyStoreVisitTask,
} from './analyticsTasks';
import { subDays } from 'date-fns';
import { logger } from '../common/logger';

const everyDayAfterMidnight = '30 0 * * *';

enum AnalyticsTasks {
  DAILY_REVENUE_PER_STORE = 'daily revenue per store',
  DAILY_ORDERS_PER_STORE = 'daily orders per store',
  DAILY_VISITS_PER_STORE = 'daily visits per store',
}

const defineAnalyticsTasks = (agenda: Agenda, app: Application) => {
  agenda.define(
    AnalyticsTasks.DAILY_ORDERS_PER_STORE,
    { concurrency: 1 },
    () => {
      const yesterday = subDays(Date.now(), 1);
      return dailyOrderCountTask(app, yesterday);
    },
  );

  agenda.define(
    AnalyticsTasks.DAILY_REVENUE_PER_STORE,
    { concurrency: 1 },
    () => {
      const yesterday = subDays(Date.now(), 1);
      return dailyRevenueTask(app, yesterday);
    },
  );

  agenda.define(
    AnalyticsTasks.DAILY_VISITS_PER_STORE,
    { concurrency: 1 },
    () => {
      const yesterday = subDays(Date.now(), 1);
      return dailyStoreVisitTask(app, yesterday);
    },
  );
};

const scheduleAnalyticsTasks = async (agenda: Agenda) => {
  await agenda.every(
    everyDayAfterMidnight,
    AnalyticsTasks.DAILY_ORDERS_PER_STORE,
  );
  await agenda.every(
    everyDayAfterMidnight,
    AnalyticsTasks.DAILY_REVENUE_PER_STORE,
  );

  await agenda.every(
    everyDayAfterMidnight,
    AnalyticsTasks.DAILY_VISITS_PER_STORE,
  );
};

export const initScheduler = async (app: Application) => {
  logger.info('Initializing scheduler...');
  const agenda = new Agenda({
    mongo: app.get('mongoDb'),
    // @ts-ignore
    db: { collection: 'schedulerJobs' },
  }).name('analytics-agenda');

  app.set('scheduler', agenda);

  defineAnalyticsTasks(agenda, app);

  await agenda.start();

  await scheduleAnalyticsTasks(agenda);
};
