import { Steps as AntSteps } from 'antd';
import { StepsProps as AntStepsProps, StepProps } from 'antd/es/steps';
import 'antd/es/steps/style/index.less';

import * as React from 'react';
import { system } from '../system';

export interface StepsProps extends AntStepsProps {
  children?: React.ReactElement<StepProps>[];
}

export const Steps = system<StepsProps>(AntSteps as any);
export const Step = system<StepProps>(AntSteps.Step);
