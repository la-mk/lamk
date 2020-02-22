import { Application, Service } from '@feathersjs/feathers';
import * as sendgridClient from '@sendgrid/mail';
import { hooks } from './hooks';
import env from '../../common/env';
import { logger } from '../../common/logger';
import { GeneralError } from '../../common/errors';

type MailClient = typeof sendgridClient;

// The actual data sengrid accepts is much larger than this, but this should do for now.
export interface EmailServiceData {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

class EmailService implements Service<EmailServiceData> {
  mailClient: MailClient;
  isProd: boolean;

  constructor(options: { mailClient: MailClient; isProd: boolean }) {
    if (!options || !options.mailClient) {
      throw new Error('Email service: `options.mailClient` must be provided');
    }

    this.mailClient = options.mailClient;
    this.isProd = options.isProd;
  }

  // @ts-ignore
  async create(data: EmailServiceData) {
    const msg = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
      mailSettings: {
        sandboxMode: {
          enable: !this.isProd,
        },
      },
    };

    try {
      const [response] = await this.mailClient.send(msg);
      return { response };
    } catch (err) {
      // Log the original error, and just return a generic error to callers. We might want to return different errors based on what the mail service responds with, but this will do for now, as the service is only called internally.
      logger.error(err);
      throw new GeneralError();
    }
  }
}

export const email = (app: Application) => {
  const mailClient = sendgridClient;
  mailClient.setApiKey(env().MAIL_SERVICE_API_KEY);

  app.use(
    '/email',
    new EmailService({ mailClient, isProd: env().NODE_ENV === 'production' }),
  );
  const service = app.service('email');
  service.hooks(hooks);
};
