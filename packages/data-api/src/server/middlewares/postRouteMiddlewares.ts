import { Application } from '@feathersjs/express';
import express from '@feathersjs/express';

export const initPostRouteMiddlewares = (app: Application) => {
  // We don't want to ever return html responses, as it can mess up JSON parsin and it requires Content-Type:application/json and Accept: application/json, which can be missed in a request.
  app.use(
    // @ts-expect-error
    express.errorHandler({
      html: false,
    }),
  );
};
