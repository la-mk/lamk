import React from 'react';
import { hooks, Spinner, Card, Text, Flex, Radio } from '@sradevski/blocks-ui';
import { useSelector } from 'react-redux';
import { getStore } from '../../../state/modules/store/store.selector';
import {
  AnalyticsTypes,
  AnalyticsFrequency,
} from '@sradevski/la-sdk/dist/models/storeAnalytics';
import { sdk } from '@sradevski/la-sdk';
import { useTranslation } from 'react-i18next';

interface StatisticsCardProps {
  title?: string;
  type?: AnalyticsTypes;
  frequencies?: AnalyticsFrequency[];
  defaultFrequency?: AnalyticsFrequency;
  children: (resp: any) => React.ReactNode;
}

export const StatisticsCard = ({
  title,
  type,
  frequencies,
  defaultFrequency,
  children,
}: StatisticsCardProps) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = hooks.useCall();
  const [result, setResult] = React.useState();
  const [frequency, setFrequency] = React.useState<
    AnalyticsFrequency | undefined
  >(defaultFrequency);

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
  }, [store, type, frequency, caller]);

  return (
    <Spinner isLoaded={!showSpinner}>
      <Card>
        {(frequencies || title) && (
          <Flex mb={3} justify='space-between' align='center'>
            {!!title && <Text as='strong'>{title}</Text>}
            {frequencies && (
              <Radio
                value={frequency}
                onChange={setFrequency as any}
                options={frequencies.map(freq => ({
                  value: freq,
                  children: t(`analyticsFrequency.${freq}`),
                }))}
                variant='button'
                ml='auto'
              />
            )}
          </Flex>
        )}

        {children(result)}
      </Card>
    </Spinner>
  );
};
