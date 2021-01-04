import * as _ from 'lodash';
import Bluebird from 'bluebird';
import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { NotAuthenticated, NotFound, BadRequest } from '../../../common/errors';
import { Service } from '@feathersjs/feathers';
import { User } from '@la-mk/la-sdk/dist/models/user';
import { getExternalUserParams } from '../../../../tests/utils';
import { FindResult } from '@la-mk/la-sdk/dist/setup';
import { Store } from '@la-mk/la-sdk/dist/models/store';
import { Campaign } from '@la-mk/la-sdk/dist/models/campaign';
import { sdk } from '@la-mk/la-sdk';
import fixtures from '../../../../tests/fixtures';

describe('"campaigns" service', () => {
  let feathersApp: Application;
  let campaigns: Service<Campaign>;
  let testUsers: User[];
  let testStores: Store[];
  let testCampaigns: Campaign[];

  beforeAll(async () => {
    feathersApp = await setup();
    campaigns = feathersApp.service('campaigns');
    testUsers = await fixtures.user(feathersApp, 2);
    testStores = await fixtures.store(feathersApp, 2, [
      {
        authenticated: true,
        user: testUsers[0],
      },
      { authenticated: true, user: testUsers[1] },
    ]);

    testCampaigns = await fixtures.campaign(
      feathersApp,
      1,
      getExternalUserParams(testUsers[0]),
      [{ forStore: testStores[0]._id }],
    );
  });

  it('create throws if not authenticated', async () => {
    expect.assertions(1);
    const campaignPromise = fixtures.campaign(
      feathersApp,
      1,
      { provider: 'rest' },
      [{ forStore: testStores[0]._id }],
    );

    await expect(campaignPromise).rejects.toThrow(NotAuthenticated);
  });

  it('patch throws if not authenticated', async () => {
    expect.assertions(1);
    const campaignPromise = campaigns.patch(
      testCampaigns[0]._id,
      { name: 'test', forStore: testStores[0]._id },
      {
        provider: 'rest',
      },
    );

    await expect(campaignPromise).rejects.toThrow(NotAuthenticated);
  });

  it('find returns campaigns for store unauthenticated', async () => {
    const campaignsForUser = (await campaigns.find({
      query: { forStore: testStores[0]._id },
      provider: 'rest',
    })) as FindResult<Campaign>;
    expect(campaignsForUser.total).toBe(1);
    expect(campaignsForUser.data[0]).toMatchObject(
      _.omit(testCampaigns[0], 'isActive', 'createdAt'),
    );
  });

  it('get returns the campaign unauthenticated', async () => {
    const campaign = await campaigns.get(testCampaigns[0]._id, {
      provider: 'rest',
    });

    expect(campaign).toMatchObject(
      _.omit(testCampaigns[0], 'isActive', 'createdAt', 'modifiedAt'),
    );
  });

  it('creates a campaign for store', async () => {
    const params = getExternalUserParams(testUsers[1]);
    const [campaign] = await fixtures.campaign(feathersApp, 1, params, [
      { forStore: testStores[1]._id },
    ]);

    expect(campaign.forStore).toBe(testStores[1]._id);
  });

  it('get returns the campaign for store', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const campaign = await campaigns.get(testCampaigns[0]._id, params);
    expect(campaign).toMatchObject(testCampaigns[0]);
  });

  it('remove throws notFound when removing campaign owned by a store the user cannot access ', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[1]);
    const campaignPromise = campaigns.remove(testCampaigns[0]._id, params);
    await expect(campaignPromise).rejects.toThrow(NotFound);
  });

  it('removes an campaign for user', async () => {
    const params = getExternalUserParams(testUsers[0]);
    const [newCampaign] = await fixtures.campaign(feathersApp, 1, params, [
      { forStore: testStores[0]._id },
    ]);
    const removedCampaign = await campaigns.remove(newCampaign._id, params);
    expect(removedCampaign._id).toBe(newCampaign._id);
  });

  it('setting percentage discount to invalid percentage throws', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[0]);
    const largerThanHundredPromise = campaigns.patch(
      testCampaigns[0]._id,
      {
        reward: {
          type: sdk.campaign.RewardTypes.PERCENTAGE_DISCOUNT,
          value: 102,
        },
      },
      params,
    );

    await expect(largerThanHundredPromise).rejects.toThrow(BadRequest);
  });

  it('throws an error when creating a campaign, if there are 10 active campaigns per store', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[1]);
    const newCampaignsPromise = Bluebird.map(
      _.range(0, 11),
      () =>
        fixtures.campaign(feathersApp, 1, params, {
          forStore: testStores[1]._id,
        }),
      // Currently if campaigns are created concurrently all of them will think there is only a single active campaign available
      { concurrency: 1 },
    );

    await expect(newCampaignsPromise).rejects.toThrow(BadRequest);
  });

  it('throws an error when patching a campaign as active, if there are 10 active campaigns per store', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[0]);
    const existingActiveCampaigns = (await campaigns.find({
      query: { forStore: testStores[0]._id },
      ...params,
    })) as FindResult<Campaign>;

    await fixtures.campaign(
      feathersApp,
      10 - existingActiveCampaigns.total,
      params,
      { forStore: testStores[0]._id },
    );

    const [inactiveCampaign] = await fixtures.campaign(feathersApp, 1, params, {
      isActive: false,
      forStore: testStores[0]._id,
    });

    const patchAsActivePromise = campaigns.patch(
      inactiveCampaign._id,
      { isActive: true },
      params,
    );

    await expect(patchAsActivePromise).rejects.toThrow(BadRequest);
  });

  it('throws an error when creating a campaign, if there is 1 promoted campaign per store', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[1]);
    await fixtures.campaign(feathersApp, 1, params, {
      isActive: false,
      isPromoted: true,
    });

    const newPromotedCampaignPromise = fixtures.campaign(
      feathersApp,
      1,
      params,
      {
        isActive: false,
        isPromoted: true,
      },
    );

    await expect(newPromotedCampaignPromise).rejects.toThrow(BadRequest);
  });

  it('throws an error when patching a campaign as active, if there is 1 promoted campaign per store', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUsers[0]);
    await fixtures.campaign(feathersApp, 1, params, {
      isActive: false,
      isPromoted: true,
    });

    const patchAsPromotedPromise = campaigns.patch(
      testCampaigns[0]._id,
      { isPromoted: true },
      params,
    );

    await expect(patchAsPromotedPromise).rejects.toThrow(BadRequest);
  });
});
