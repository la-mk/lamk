import { Steps as AntSteps } from 'antd';
import { StepsProps as AntStepsProps, StepProps } from 'antd/lib/steps';
import * as React from 'react';
import styled from 'styled-components';

export interface StepsProps extends AntStepsProps {
  children?: React.ReactElement<StepProps>[];
}

export const Steps = styled(AntSteps)``;
export const Step = styled(AntSteps.Step)``;
