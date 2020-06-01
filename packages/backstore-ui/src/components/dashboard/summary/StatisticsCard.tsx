import React from 'react';
import {
  hooks,
  Spin,
  Card,
  Text,
  RadioGroup,
  RadioButton,
  Flex,
} from '@sradevski/blocks-ui';
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
  const [frequency, setFrequency] = React.useState(defaultFrequency);

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
    <Spin spinning={showSpinner}>
      <Card>
        {(frequencies || title) && (
          <Flex mb={3} justifyContent='space-between' alignItems='center'>
            {!!title && <Text strong>{title}</Text>}
            {frequencies && (
              <RadioGroup
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                ml='auto'
              >
                {frequencies.map(f => {
                  return (
                    <RadioButton value={f} key={f}>
                      {t(`analyticsFrequency.${f}`)}
                    </RadioButton>
                  );
                })}
              </RadioGroup>
            )}
          </Flex>
        )}

        {children(result)}
      </Card>
    </Spin>
  );
};
