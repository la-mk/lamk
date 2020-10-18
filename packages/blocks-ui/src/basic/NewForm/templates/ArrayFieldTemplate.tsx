import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import * as React from 'react';
import { ArrayFieldTemplateProps } from '@rjsf/core';
import { Flex } from '../../Flex';
import { Box } from '../../Box';
import { Button } from '../../Button';

interface ArrayFieldTitleProps {
  TitleField: ArrayFieldTemplateProps['TitleField'];
  idSchema: ArrayFieldTemplateProps['idSchema'];
  title?: string;
  required: boolean;
}

const ArrayFieldTitle = ({
  TitleField,
  idSchema,
  required,
  title,
}: ArrayFieldTitleProps) => {
  if (!title) {
    return null;
  }
  const id = `${idSchema.$id}__title`;
  return <TitleField id={id} title={title} required={required} />;
};

interface ArrayFieldDescriptionProps {
  DescriptionField: ArrayFieldTemplateProps['DescriptionField'];
  idSchema: ArrayFieldTemplateProps['idSchema'];
  description?: string | JSX.Element;
}

const ArrayFieldDescription = ({
  DescriptionField,
  idSchema,
  description,
}: ArrayFieldDescriptionProps) => {
  if (!description) {
    return null;
  }
  const id = `${idSchema.$id}__description`;
  return <DescriptionField id={id} description={description} />;
};

export default (props: ArrayFieldTemplateProps) => {
  const orderable = props.uiSchema['ui:options']?.orderable ?? true;

  return (
    <div className={props.uiSchema.classNames}>
      <ArrayFieldTitle
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={props.uiSchema['ui:title'] || props.title}
        required={props.required}
      />

      <ArrayFieldDescription
        DescriptionField={props.DescriptionField}
        idSchema={props.idSchema}
        description={
          props.uiSchema['ui:description'] || props.schema.description
        }
      />

      {props.items.map(element => {
        return (
          <div className="rendition-form__array-item" key={element.index}>
            <Flex alignItems="flex-start">
              <Box flex="1">{element.children}</Box>
              <Box>
                {orderable && props.items.length > 1 && (
                  <Button
                    className="rendition-form-array-item__move-up"
                    py={1}
                    px={2}
                    disabled={
                      element.disabled || element.readonly || !element.hasMoveUp
                    }
                    onClick={element.onReorderClick(
                      element.index,
                      element.index - 1
                    )}
                  >
                    <ArrowUpOutlined />
                  </Button>
                )}

                {orderable && props.items.length > 1 && (
                  <Button
                    className="rendition-form-array-item__move-down"
                    py={1}
                    px={2}
                    disabled={
                      element.disabled ||
                      element.readonly ||
                      !element.hasMoveDown
                    }
                    onClick={element.onReorderClick(
                      element.index,
                      element.index + 1
                    )}
                  >
                    <ArrowDownOutlined />
                  </Button>
                )}

                {element.hasRemove && (
                  <Button
                    className="rendition-form-array-item__remove-item"
                    py={1}
                    px={2}
                    disabled={element.disabled || element.readonly}
                    onClick={element.onDropIndexClick(element.index)}
                  >
                    <DeleteOutlined />
                  </Button>
                )}
              </Box>
            </Flex>
          </div>
        );
      })}

      {props.canAdd && (
        <Button mt={3} onClick={props.onAddClick}>
          <PlusOutlined />
        </Button>
      )}
    </div>
  );
};
