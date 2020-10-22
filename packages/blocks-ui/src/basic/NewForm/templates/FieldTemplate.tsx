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
  rawHelp,
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
      <Box>
        {rawErrors?.[0] && (
          <Text fontSize={0} color="danger">
            {rawErrors?.[0]}
          </Text>
        )}

        {!rawErrors?.[0] && rawHelp && (
          <Text fontSize={0} color="mutedText.dark">
            {rawHelp}
          </Text>
        )}
      </Box>
    </Box>
  );
};
