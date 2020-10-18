import React from 'react';
import { FieldTemplateProps } from '@rjsf/core';
import { Box } from '../../Box';
import { Paragraph, Text } from '../../Typography';

export default ({
  children,
  classNames,
  description,
  displayLabel,
  rawErrors,
  hidden,
  id,
  label,
}: FieldTemplateProps) => {
  if (hidden) {
    return children;
  }

  return (
    <Box mb={3} className={`${classNames || ''} rendition-form__field--${id}`}>
      {displayLabel && (
        <Box mb={2}>
          <Text fontSize={0} id={id}>
            {label}
          </Text>
        </Box>
      )}

      {displayLabel && description ? (
        <Box mb={2}>
          <Paragraph fontSize={0} id={id}>
            {description}
          </Paragraph>
        </Box>
      ) : null}
      {children}
      <Text color="danger">{rawErrors?.[0]}</Text>
    </Box>
  );
};
