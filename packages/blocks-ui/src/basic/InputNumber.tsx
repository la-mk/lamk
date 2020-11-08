import React from 'react';
import { InputNumber as AntInputNumber } from 'antd';
import { InputNumberProps } from 'antd/es/input-number';
import 'antd/es/input-number/style/index.less';

import { system } from '../system';

const BaseInputNumber = system<InputNumberProps>(AntInputNumber);

export const InputNumber = ({
  suffix,
  prefix,
  ...props
}: React.ComponentProps<typeof BaseInputNumber> & {
  suffix?: string;
  prefix?: string;
}) => {
  const numberFix = React.useMemo(
    () =>
      prefix || suffix
        ? {
            formatter: (value: string | number | undefined) => {
              if (!value) {
                return '';
              }
              return `${prefix ?? ''} ${value} ${suffix ?? ''}`.trim();
            },

            parser: (value: string | number | undefined) =>
              (value || '').toString().replace(/[^0-9.]/g, ''),
          }
        : {},
    [prefix, suffix]
  );

  return <BaseInputNumber {...numberFix} {...props} />;
};
