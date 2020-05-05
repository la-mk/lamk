import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

export const TimeLineChart = ({
  lines,
  data,
}: {
  lines: (t: TFunction) => JSX.Element[];
  data: any;
}) => {
  const { t } = useTranslation();
  let domain: any = [Date.now(), Date.now()];

  if (data && data.length >= 1) {
    const minTimestamp = new Date(data[0].timestamp).getTime();
    const maxTimestamp = new Date(data[data.length - 1]).getTime();
    domain = [minTimestamp, maxTimestamp];
  }

  return (
    <ResponsiveContainer height={350} width='100%'>
      <LineChart data={data}>
        <CartesianGrid stroke='#f5f5f5' />
        <XAxis
          type='number'
          domain={domain}
          tickFormatter={entry => new Date(entry).toDateString()}
          dataKey={entry => new Date(entry.timestamp).getTime()}
        />
        <YAxis />
        <Tooltip
          labelFormatter={timestamp => new Date(timestamp).toDateString()}
        />
        <Legend />
        {lines(t)}
      </LineChart>
    </ResponsiveContainer>
  );
};
