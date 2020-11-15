import React from 'react';
import { FieldProps } from '@rjsf/core';
import { Label } from '../../Typography';

const TitleField = ({ title, required }: FieldProps) => {
  if (!title) {
    return null;
  }

  return (
    <Label mb={1} size="small">
      {title}
      {required ? (
        <Label display="inline" color="contentNegative">
          *
        </Label>
      ) : null}
    </Label>
  );
};

export default TitleField;
