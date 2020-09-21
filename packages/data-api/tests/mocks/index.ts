import nock from 'nock';

export const mockDefaults = () => {
  nock.disableNetConnect();
  nock.enableNetConnect('lamk.dev');
  nock('https://api.sendgrid.com').persist().post('/v3/mail/send').reply(200);
  nock('https://api.sendgrid.com')
    .persist()
    .options('/v3/mail/send')
    .reply(200);
};

mockDefaults();
