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
import { Tabs, TabPane } from '../../Tabs';

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
  const [activeItem, setActiveItem] = React.useState('0');
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

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    switch (action) {
      case 'add': {
        onAddClick();
        setActiveItem(items.length.toString());
        return;
      }

      case 'remove': {
        const item = items[parseInt(targetKey as string)];
        if (!item) {
          return;
        }

        item.onDropIndexClick(item.index)();
        setActiveItem(Math.max(item.index - 1, 0).toString());
      }
    }
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
          activeKey={activeItem}
          onChange={setActiveItem}
          type="editable-card"
          onEdit={onEdit}
          hideAdd={items.length >= maxItems}
        >
          {items.map((entry, index) => {
            return (
              <TabPane
                disabled={entry.disabled || entry.readonly}
                tab={itemTitles?.[index] ?? index}
                key={index.toString()}
                closable={index >= minItems}
              >
                {entry.children}
              </TabPane>
            );
          })}
        </Tabs>
      )}

      {!asTabs && (
        <>
          {items.map(element => {
            return (
              <Flex
                key={element.index}
                flexDirection="row"
                alignItems="flex-start"
              >
                <Box flex="1" mx="-16px" style={{ overflow: 'hidden' }}>
                  {element.children}
                </Box>
                {shouldShowActions && (
                  <Flex ml={3} alignItems="center" justifyContent="center">
                    {showSort && (
                      <Button
                        mx={1}
                        disabled={
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
                        mx={1}
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

                    {showRemove && (
                      <Button
                        mx={1}
                        disabled={element.disabled || element.readonly}
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
            <Button mt={3} onClick={onAddClick}>
              <PlusOutlined />
            </Button>
          )}
        </>
      )}
    </div>
  );
};
