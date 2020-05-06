import got from 'got/dist/source';
import env from '../../common/env';
import * as querystring from 'querystring';
import { format } from 'date-fns';
import {
  AnalyticsFrequency,
  StoreAnalyticsEntry,
} from '@sradevski/la-sdk/dist/models/storeAnalytics';
import { sdk } from '@sradevski/la-sdk';

const AMPLITUDE_ENDPOINT = 'https://amplitude.com/api/2';
const SEGMENTATION_ENDPOINT = `${AMPLITUDE_ENDPOINT}/events/segmentation`;

interface EventSegmentationResponse {
  data: {
    seriesLabels: string[][];
    seriesCollapsed: [[{ setId: string; value: number }]];
    seriesIntervals: any;
    series: number[][];
    xValues: string[];
  };
  // There are many more properties, but we don't care for those.
}

const makeRequest = async (endpoint: string, query: any) => {
  const stringifiedQuery = querystring.stringify(query);
  const url = `${endpoint}?${stringifiedQuery}`;
  const authToken = `${env().ANALYTICS_TRACKING_ID}:${
    env().ANALYTICS_SECRET_KEY
  }`;

  const resp = await got(url, {
    method: 'GET',
    headers: {
      authorization: `Basic ${Buffer.from(authToken).toString('base64')}`,
    },
  });

  return JSON.parse(resp.body);
};

const formatDateForRequest = (date: Date) => {
  return format(date, 'yyyyMMdd');
};

const getFrequencyForRequest = (frequency: AnalyticsFrequency) => {
  switch (frequency) {
    case sdk.storeAnalytics.AnalyticsFrequency.HOURLY: {
      return -3600000;
    }
    case sdk.storeAnalytics.AnalyticsFrequency.DAILY: {
      return 1;
    }
    case sdk.storeAnalytics.AnalyticsFrequency.WEEKLY: {
      return 7;
    }
    case sdk.storeAnalytics.AnalyticsFrequency.MONTHLY: {
      return 30;
    }
  }
};

// Transforms an amplitude response to the analytics model that we store.
// export const transform = ({ data }: EventSegmentationResponse) => {};

const transformStoreVisit = (
  { data }: EventSegmentationResponse,
  storeIds: string[],
  frequency: AnalyticsFrequency,
) => {
  const res: Omit<
    StoreAnalyticsEntry,
    '_id' | 'createdAt' | 'modifiedAt' | 'type'
  >[] = [];
  const storeIdsMap = data.seriesLabels.reduce(
    (storeIdsMap: any, [, storeId], index) => {
      storeIdsMap[storeId] = index;
      return storeIdsMap;
    },
    {},
  );

  storeIds.forEach(storeId => {
    data.xValues.forEach((date, xIndex) => {
      // Amplitude doesn't return any results for the storeId if it has no data for the passed range, so we fill-in that data with the default value
      const storeIndex = storeIdsMap[storeId];
      const value = { total: 0 };
      if (storeIndex >= 0) {
        value.total = data.series[storeIdsMap[storeId]][xIndex];
      }

      res.push({
        forStore: storeId,
        timestamp: new Date(date).toISOString(),
        value,
        frequency,
      });
    });
  });

  return res;
};

export const getStoreVisits = async (
  storeIds: string[],
  frequency: AnalyticsFrequency,
  from: Date,
  to: Date,
) => {
  const event = {
    event_type: 'store: open store',
    group_by: [
      {
        type: 'event',
        value: 'storeId',
      },
    ],
  };

  const query = {
    e: JSON.stringify(event),
    m: 'totals',
    limit: 1000,
    start: formatDateForRequest(from),
    end: formatDateForRequest(to),
    i: getFrequencyForRequest(frequency),
  };

  const resp = await makeRequest(SEGMENTATION_ENDPOINT, query);
  return transformStoreVisit(resp, storeIds, frequency);
};
