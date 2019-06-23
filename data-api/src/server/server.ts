import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
import * as compress from 'compression';
import * as helmet from 'helmet';
import * as cors from 'cors';

import { logger, registerLogger } from '../common/logger';
import { registerServices } from './routes/services';
import { registerHooks } from './hooks/hooks';
import { registerChannels } from './channels/channels';
import env from './env';

const app = express(feathers());

app.use(helmet());
app.use(cors());
app.use(compress());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());
app.configure(socketio());

registerLogger({ env: env.NODE_ENV });
registerServices(app);
registerHooks(app);
registerChannels(app);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

export default () => app.listen(env.SERVER_PORT);
