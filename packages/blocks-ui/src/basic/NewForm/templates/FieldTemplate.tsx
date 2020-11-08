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
  uiSchema,
}: FieldTemplateProps) => {
  if (hidden) {
    return children;
  }

  const { mt, mb, minWidth, maxWidth, flex } = (uiSchema['ui:options'] ??
    {}) as {
    mt: string | number | string[] | number[] | undefined;
    mb: string | number | string[] | number[] | undefined;
    minWidth: string | number | string[] | number[] | undefined;
    maxWidth: string | number | string[] | number[] | undefined;
    flex: number | string;
  };

  return (
    <Box
      mb={mb ?? 2}
      mt={mt}
      mx={3}
      width={'calc(100% - 32px)'}
      className={`${classNames || ''}`}
      flex={flex ?? 1}
      minWidth={minWidth ?? 'calc(100% - 32px)'}
      maxWidth={maxWidth ?? 'calc(100% - 32px)'}
    >
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
