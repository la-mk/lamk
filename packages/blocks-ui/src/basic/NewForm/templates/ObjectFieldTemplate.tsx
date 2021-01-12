import * as React from 'react';
import { ObjectFieldTemplateProps } from '@rjsf/core';
import { Flex } from '../../Flex';
import { Box } from '../../Box';

const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const { TitleField, DescriptionField } = props;
  const { mt, asOneOf, sections } = (props.uiSchema['ui:options'] ?? {}) as {
    mt: string | number | string[] | number[] | undefined;
    asOneOf: boolean | undefined;
    sections: Array<{
      sectionTitle: React.ReactNode;
      properties: string[];
    }>;
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

      {/* Because of our custom ObjectField, properties might be a widget */}
      {!Array.isArray(props.properties) && props.properties}

      {Array.isArray(props.properties) && !sections && (
        <Flex wrap={'wrap'} mx={'-1rem'} overflow="hidden">
          {props.properties.map((prop: any, i) => (
            <React.Fragment key={i}>{prop.content}</React.Fragment>
          ))}
        </Flex>
      )}

      {Array.isArray(props.properties) &&
        sections &&
        sections.map((section, i) => {
          return (
            <Flex key={i} direction={'column'} wrap={'nowrap'}>
              {section.sectionTitle}
              <Flex wrap="wrap" mx={'-1rem'} overflow="hidden">
                {props.properties
                  .filter(property =>
                    section.properties.includes(property.name)
                  )
                  .map((prop: any, j) => (
                    <React.Fragment key={j}>{prop.content}</React.Fragment>
                  ))}
              </Flex>
            </Flex>
          );
        })}
    </Box>
  );
};

export default ObjectFieldTemplate;
