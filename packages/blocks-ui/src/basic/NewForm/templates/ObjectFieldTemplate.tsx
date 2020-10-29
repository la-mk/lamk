import * as React from 'react';
import { ObjectFieldTemplateProps } from '@rjsf/core';
import { Flex } from '../../Flex';
import { Box } from '../../Box';

const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const { TitleField, DescriptionField } = props;
  const { mt, asOneOf } = (props.uiSchema['ui:options'] ?? {}) as {
    mt: string | number | string[] | number[] | undefined;
    asOneOf: boolean | undefined;
  };

  return (
    <Box mt={asOneOf ? undefined : mt}>
      {!asOneOf && props.uiSchema['ui:title'] && (
        <TitleField
          id={`${props.idSchema.$id}__title`}
          title={props.uiSchema['ui:title']}
          required={props.required}
        />
      )}
      {!asOneOf && props.uiSchema['ui:description'] && (
        <DescriptionField
          id={`${props.idSchema.$id}__description`}
          description={props.uiSchema['ui:description']}
        />
      )}

      <Flex flexDirection={'column'} flexWrap={'nowrap'}>
        {props.properties.map((prop: any, i) => (
          <Box key={i}>{prop.content}</Box>
        ))}
      </Flex>
    </Box>
  );
};

export default ObjectFieldTemplate;
