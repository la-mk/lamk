import React from 'react';
import { WidgetProps } from '@rjsf/core';
import TextWidget from './TextWidget';

const EmailWidget = (props: WidgetProps) => {
  return <TextWidget {...props} inputMode={'email'} />;
};

export default EmailWidget;
