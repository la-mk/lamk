import React from 'react';
import { hooks, Spin, Card, Title } from '@sradevski/blocks-ui';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import {
  AnalyticsTypes,
  AnalyticsFrequency,
} from '@sradevski/la-sdk/dist/models/storeAnalytics';
import { sdk } from '@sradevski/la-sdk';

interface StatisticsCardProps {
  title?: string;
  type?: AnalyticsTypes;
  frequency?: AnalyticsFrequency;
  children: (resp: any) => React.ReactNode;
}

export const StatisticsCard = ({
  title,
  type,
  frequency,
  children,
}: StatisticsCardProps) => {
  const [caller, showSpinner] = hooks.useCall();
  const [result, setResult] = React.useState();
  const store = useSelector(getStore);

  React.useEffect(() => {
    if (!store?._id || !type) {
      return;
    }

    caller(
      sdk.storeAnalytics.get(store._id, {
        query: {
          forStore: store._id,
          type,
          frequency,
        },
      }),
      res => {
        if (res) {
          setResult(res[type]);
        }
      },
    );
  }, [store, type]);

  return (
    <Spin spinning={showSpinner}>
      <Card>
        {!!title && <Title level={4}>{title}</Title>}
        {children(result)}
      </Card>
    </Spin>
  );
};
