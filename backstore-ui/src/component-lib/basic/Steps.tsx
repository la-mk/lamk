import { Steps as AntSteps } from 'antd';
import { StepsProps as AntStepsProps, StepProps } from 'antd/lib/steps';
import * as React from 'react';
import styled from 'styled-components';
import { system } from '../system';

export interface StepsProps extends AntStepsProps {
  children?: React.ReactElement<StepProps>[];
}

export const Steps = system<StepsProps>(AntSteps);
export const Step = system<StepProps>(AntSteps.Step);
