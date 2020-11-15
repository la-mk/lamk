import React from 'react';
import { FieldTemplateProps } from '@rjsf/core';
import { Box } from '../../Box';
import { Paragraph } from '../../Typography';

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
    ? minWidth.map(x => `calc(${x} - 32px)`)
    : `calc(${minWidth ?? '100%'} - 32px)`;

  const normalizedMaxWidth = Array.isArray(maxWidth)
    ? maxWidth.map(x => `calc(${x} - 32px)`)
    : `calc(${maxWidth ?? '100%'} - 32px)`;

  return (
    <Box
      mb={mb ?? 2}
      mt={mt}
      mx={3}
      width={'calc(100% - 32px)'}
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
          <Paragraph size="xsmall" color="danger">
            {rawErrors?.[0]}
          </Paragraph>
        )}

        {!rawErrors?.[0] && rawHelp && (
          <Paragraph size="xsmall" color="mutedText.dark">
            {rawHelp}
          </Paragraph>
        )}
      </Box>
    </Box>
  );
};
