import { Steps as AntSteps } from 'antd';
import { StepsProps as AntStepsProps, StepProps } from 'antd/lib/steps';
import 'antd/lib/steps/style/index.less';

import * as React from 'react';
import { system } from '../system';

export interface StepsProps extends AntStepsProps {
  children?: React.ReactElement<StepProps>[];
}

export const Steps = system<StepsProps>(AntSteps);
export const Step = system<StepProps>(AntSteps.Step);
