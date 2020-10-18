import * as React from 'react';
import { ObjectFieldTemplateProps } from '@rjsf/core';
import { Flex } from '../../Flex';
import { Box } from '../../Box';

const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const { TitleField, DescriptionField } = props;
  const responsive = !!props.uiSchema['ui:options']?.responsive;

  return (
    <section>
      {props.schema.title && (props.uiSchema['ui:title'] || props.title) && (
        <TitleField
          id={`${props.idSchema.$id}__title`}
          title={props.title || props.uiSchema['ui:title']}
          required={props.required}
        />
      )}
      {props.description && (
        <DescriptionField
          id={`${props.idSchema.$id}__description`}
          description={props.description}
        />
      )}

      <Flex
        flexDirection={responsive ? 'row' : 'column'}
        flexWrap={responsive ? 'wrap' : 'nowrap'}
      >
        {props.properties.map((prop: any) => (
          <Box>{prop.content}</Box>
        ))}
      </Flex>
    </section>
  );
};

export default ObjectFieldTemplate;
