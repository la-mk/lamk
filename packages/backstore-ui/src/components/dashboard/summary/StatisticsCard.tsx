import React from 'react';
import { hooks, Spin, Card } from '@sradevski/blocks-ui';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import {
  AnalyticsTypes,
  AnalyticsFrequency,
} from '@sradevski/la-sdk/dist/models/storeAnalytics';
import { sdk } from '@sradevski/la-sdk';

interface StatisticsCardProps {
  type: AnalyticsTypes;
  frequency?: AnalyticsFrequency;
  children: (resp: any) => React.ReactNode;
}

export const StatisticsCard = ({ type, children }: StatisticsCardProps) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const [result, setResult] = React.useState();
  const store = useSelector(getStore);

  React.useEffect(() => {
    if (!store?._id) {
      return;
    }

    caller(
      sdk.storeAnalytics.get(store._id, {
        query: {
          forStore: store._id,
          type,
        },
      }),
      res => {
        if (res) {
          setResult(res[type]);
        }
      },
    );
  }, []);

  return (
    <Spin spinning={showSpinner}>
      <Card>{children(result)}</Card>
    </Spin>
  );
};
