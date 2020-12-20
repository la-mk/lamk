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
import { Tabs } from '../../Tabs';

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

export default ({
  TitleField,
  DescriptionField,
  idSchema,
  uiSchema,
  required,
  items,
  canAdd,
  onAddClick,
  schema,
}: ArrayFieldTemplateProps) => {
  const [activeItem, setActiveItem] = React.useState(0);
  const orderable = uiSchema['ui:options']?.orderable ?? true;
  const hidden = uiSchema['ui:widget'] === 'hidden';
  const asTabs = uiSchema['ui:widget'] === 'tabs';

  const { minItems = 0, maxItems = Number.POSITIVE_INFINITY } = schema;

  const showSort = orderable && items.length > 1;
  const showRemove = /*element.hasRemove  &&*/ items.length > minItems;
  const showAdd = canAdd && items.length < maxItems;
  const shouldShowActions = showSort || showRemove;
  const itemTitles = uiSchema['ui:options']?.itemTitles as any[];

  if (hidden) {
    return null;
  }

  const onAdd = () => {
    onAddClick();
    setActiveItem(items.length);
  };

  const onRemove = (index: number) => {
    const item = items[index];
    if (!item) {
      return;
    }

    item.onDropIndexClick(index)();
    setActiveItem(Math.max(index - 1, 0));
  };

  return (
    <div>
      <ArrayFieldTitle
        TitleField={TitleField}
        idSchema={idSchema}
        title={uiSchema['ui:title']}
        required={required}
      />

      <ArrayFieldDescription
        DescriptionField={DescriptionField}
        idSchema={idSchema}
        description={uiSchema['ui:description']}
      />

      {asTabs && (
        <Tabs
          index={activeItem}
          onChange={setActiveItem}
          items={items.map((item, index) => ({
            title: itemTitles?.[index] ?? index,
            content: item.children,
            isClosable: index >= minItems,
          }))}
          isExpandable={items.length < maxItems}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      )}

      {!asTabs && (
        <>
          {items.map(element => {
            // Non-scalar array children have to have a unique key to handle reordering correctly, see: https://github.com/rjsf-team/react-jsonschema-form/issues/1046
            return (
              <Flex key={element.key} direction="row" align="flex-start">
                <Box flex="1" mx="-1rem" overflow="hidden">
                  {element.children}
                </Box>
                {shouldShowActions && (
                  <Flex ml={3} align="center" justify="center">
                    {showSort && (
                      <Button
                        mx={2}
                        isDisabled={
                          element.disabled ||
                          element.readonly ||
                          !element.hasMoveUp
                        }
                        onClick={element.onReorderClick(
                          element.index,
                          element.index - 1
                        )}
                      >
                        <ArrowUpOutlined />
                      </Button>
                    )}

                    {showSort && (
                      <Button
                        mx={2}
                        isDisabled={
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

                    {showRemove && (
                      <Button
                        variant="outline"
                        mx={2}
                        isDisabled={element.disabled || element.readonly}
                        onClick={element.onDropIndexClick(element.index)}
                      >
                        <DeleteOutlined />
                      </Button>
                    )}
                  </Flex>
                )}
              </Flex>
            );
          })}

          {showAdd && (
            <Button size="sm" mt={3} onClick={onAddClick}>
              <PlusOutlined />
            </Button>
          )}
        </>
      )}
    </div>
  );
};
