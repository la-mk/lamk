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
    minWidth: string | string[] | undefined;
    maxWidth: string | string[] | undefined;
    flex: number | string;
  };

  const normalizedMinWidth = Array.isArray(minWidth)
    ? minWidth.map(x => `calc(${x} - 2rem)`)
    : `calc(${minWidth ?? '100%'} - 2rem)`;

  const normalizedMaxWidth = Array.isArray(maxWidth)
    ? maxWidth.map(x => `calc(${x} - 2rem)`)
    : `calc(${maxWidth ?? '100%'} - 2rem)`;

  return (
    <Box
      mb={mb ?? 3}
      mt={mt}
      mx={4}
      width={'calc(100% - 2rem)'}
      className={`${classNames || ''}`}
      flex={flex ?? 1}
      minWidth={normalizedMinWidth}
      maxWidth={normalizedMaxWidth}
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
