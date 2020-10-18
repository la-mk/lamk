import React from 'react';
import { FieldProps } from '@rjsf/core';
import { Paragraph } from '../../Typography';

const DescriptionField = ({ description, id }: FieldProps) => {
  if (!description) {
    return null;
  }

  return (
    <Paragraph mb={1} color="mutedText.dark" id={id}>
      {description}
    </Paragraph>
  );
};

export default DescriptionField;
