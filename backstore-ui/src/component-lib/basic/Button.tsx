import { Button as AntButton } from 'antd';
import { ButtonProps } from 'antd/lib/button/button';
import * as React from 'react';
import styled from 'styled-components';

export const Button = styled((props: ButtonProps) => (
  <AntButton {...props} />
))``;
