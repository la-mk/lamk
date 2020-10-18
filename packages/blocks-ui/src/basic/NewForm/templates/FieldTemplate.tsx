import React from 'react';
import { FieldTemplateProps } from '@rjsf/core';
import { Box } from '../../Box';
import { Text } from '../../Typography';

export default ({
  children,
  classNames,
  description,
  displayLabel,
  rawErrors,
  hidden,
  label,
}: FieldTemplateProps) => {
  if (hidden) {
    return children;
  }

  return (
    <Box mb={2} className={`${classNames || ''}`}>
      {displayLabel ? label : null}
      {displayLabel && description ? description : null}
      {children}
      <Text color="danger">{rawErrors?.[0]}</Text>
    </Box>
  );
};
