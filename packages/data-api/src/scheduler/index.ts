// TODO: Move the scheduler to a separate service, using a separate DB
import Agenda from 'agenda';
import { Application } from '@feathersjs/express';
import { dailyOrderCountTask, dailyRevenueTask } from './analyticsTasks';
import { subDays } from 'date-fns';

const everyDayAfterMidnight = '30 0 * * *';

enum AnalyticsTasks {
  DAILY_REVENUE_PER_STORE = 'daily revenue per store',
  DAILY_ORDERS_PER_STORE = 'daily orders per store',
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
};

export const initScheduler = async (app: Application) => {
  const agenda = new Agenda({
    mongo: app.get('mongoDb'),
    db: { collection: 'schedulerJobs' },
  }).name('analytics-agenda');

  defineAnalyticsTasks(agenda, app);

  await agenda.start();

  await scheduleAnalyticsTasks(agenda);
};
