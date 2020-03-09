import * as _ from 'lodash';
import Bluebird from 'bluebird';
import setup from '../../../server/server';
import { Application } from '@feathersjs/express';
import { NotAuthenticated, NotFound, BadRequest } from '../../../common/errors';
import { Service } from '@feathersjs/feathers';
import { User } from '@sradevski/la-sdk/dist/models/user';
import { getExternalUserParams } from '../../../../tests/utils';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { Campaign } from '@sradevski/la-sdk/dist/models/campaign';
import { sdk } from '@sradevski/la-sdk';

const userFixture = {
  email: 'campaigns@fixture.com',
  password: 'supersecret',
};

const user2Fixture = {
  email: 'campaigns2@fixture.com',
  password: 'supersecret',
};

const storeFixture: Partial<Store> = {
  name: 'Test campaigns',
  slug: 'campaigns-test',
  logo: '2345',
  company: {
    companyName: 'Test',
    companyAddress: 'Test',
    registryNumber: 'Test',
    taxNumber: 'Test',
  },
  contact: {
    email: 'campaigns@test.com',
    phoneNumber: '23456',
  },
  isPublished: true,
};

const campaignFixture: Partial<Campaign> = {
  name: 'Test campaign',
  isActive: true,
  isPromoted: false,
  type: sdk.campaign.CampaignTypes.CART_DISCOUNT,
  reward: {
    type: sdk.campaign.RewardTypes.PERCENTAGE_DISCOUNT,
    value: 20,
  },
  productRules: [
    {
      type: sdk.campaign.ProductRuleTypes.ALL,
      value: 'all',
    },
  ],
};

describe('"campaigns" service', () => {
  let feathersApp: Application;
  let users: Service<User>;
  let campaigns: Service<Campaign>;
  let stores: Service<Store>;
  let testUser: User;
  let testUser2: User;
  let testStore: Store;
  let testStore2: Store;
  let testCampaign: Campaign;

  beforeAll(async () => {
    feathersApp = await setup();
    users = feathersApp.service('users');
    campaigns = feathersApp.service('campaigns');
    stores = feathersApp.service('stores');
    testUser = await users.create(userFixture);
    testUser2 = await users.create(user2Fixture);
    testStore = await stores.create(storeFixture, {
      authenticated: true,
      user: testUser,
    });
    testStore2 = await stores.create(storeFixture, {
      authenticated: true,
      user: testUser2,
    });
    testCampaign = await campaigns.create(
      {
        ...campaignFixture,
        forStore: testStore._id,
      },
      getExternalUserParams(testUser),
    );
  });

  it('create throws if not authenticated', async () => {
    expect.assertions(1);
    const campaignPromise = campaigns.create(
      { ...campaignFixture, forStore: testStore._id },
      {
        provider: 'rest',
      },
    );

    await expect(campaignPromise).rejects.toThrow(NotAuthenticated);
  });

  it('patch throws if not authenticated', async () => {
    expect.assertions(1);
    const campaignPromise = campaigns.patch(
      testCampaign._id,
      { ...campaignFixture, forStore: testStore._id },
      {
        provider: 'rest',
      },
    );

    await expect(campaignPromise).rejects.toThrow(NotAuthenticated);
  });

  it('find returns campaigns for store unauthenticated', async () => {
    const campaignsForUser = (await campaigns.find({
      query: { forStore: testStore._id },
      provider: 'rest',
    })) as FindResult<Campaign>;
    expect(campaignsForUser.total).toBe(1);
    expect(campaignsForUser.data[0]).toMatchObject(
      _.omit(campaignFixture, 'isActive'),
    );
  });

  it('get returns the campaign unauthenticated', async () => {
    const campaign = await campaigns.get(testCampaign._id, {
      provider: 'rest',
    });
    expect(campaign).toMatchObject(
      _.omit(testCampaign, 'isActive', 'createdAt', 'modifiedAt'),
    );
  });

  it('creates a campaign for store', async () => {
    const params = getExternalUserParams(testUser2);
    const campaign = await campaigns.create(
      { ...campaignFixture, forStore: testStore2._id },
      params,
    );

    expect(campaign).toMatchObject(campaignFixture);
    expect(campaign.forStore).toBe(testStore2._id);
  });

  it('get returns the campaign for store', async () => {
    const params = getExternalUserParams(testUser);
    const campaign = await campaigns.get(testCampaign._id, params);
    expect(campaign).toMatchObject(testCampaign);
  });

  it('remove throws notFound when removing campaign owned by a store the user cannot access ', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUser2);
    const campaignPromise = campaigns.remove(testCampaign._id, params);
    await expect(campaignPromise).rejects.toThrow(NotFound);
  });

  it('removes an campaign for user', async () => {
    const params = getExternalUserParams(testUser);
    const newCampaign = await campaigns.create(
      {
        ...campaignFixture,
        forStore: testStore._id,
        name: 'New campaign',
      },
      params,
    );
    const removedCampaign = await campaigns.remove(newCampaign._id, params);
    expect(removedCampaign._id).toBe(newCampaign._id);
  });

  it('setting percentage discount to invalid percentage throws', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUser);
    const largerThanHundredPromise = campaigns.patch(
      testCampaign._id,
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
    const params = getExternalUserParams(testUser2);
    const newCampaignsPromise = Bluebird.map(
      _.range(0, 11),
      () =>
        campaigns.create(
          {
            ...campaignFixture,
            forStore: testStore2._id,
            name: 'New campaign',
          },
          params,
        ),
      // Currently if campaigns are created concurrently all of them will think there is only a single active campaign available
      { concurrency: 1 },
    );

    await expect(newCampaignsPromise).rejects.toThrow(BadRequest);
  });

  it('throws an error when patching a campaign as active, if there are 10 active campaigns per store', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUser);
    const existingActiveCampaigns = (await campaigns.find({
      query: { forStore: testStore._id },
      ...params,
    })) as FindResult<Campaign>;

    await Bluebird.map(_.range(0, 10 - existingActiveCampaigns.total), () => {
      return campaigns.create(
        {
          ...campaignFixture,
          forStore: testStore._id,
          name: 'New campaign',
        },
        params,
      );
    });

    const inactiveCampaign = await campaigns.create(
      { ...campaignFixture, isActive: false, forStore: testStore._id },
      params,
    );

    const patchAsActivePromise = campaigns.patch(
      inactiveCampaign._id,
      { isActive: true },
      params,
    );

    await expect(patchAsActivePromise).rejects.toThrow(BadRequest);
  });

  it('throws an error when creating a campaign, if there is 1 promoted campaign per store', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUser2);
    await campaigns.create(
      {
        ...campaignFixture,
        isActive: false,
        isPromoted: true,
      },
      params,
    );

    const newPromotedCampaignPromise = campaigns.create(
      {
        ...campaignFixture,
        isActive: false,
        isPromoted: true,
      },
      params,
    );

    await expect(newPromotedCampaignPromise).rejects.toThrow(BadRequest);
  });

  it('throws an error when patching a campaign as active, if there is 1 promoted campaign per store', async () => {
    expect.assertions(1);
    const params = getExternalUserParams(testUser);
    await campaigns.create(
      {
        ...campaignFixture,
        isActive: false,
        isPromoted: true,
      },
      params,
    );

    const patchAsPromotedPromise = campaigns.patch(
      testCampaign._id,
      { isPromoted: true },
      params,
    );

    await expect(patchAsPromotedPromise).rejects.toThrow(BadRequest);
  });
});
