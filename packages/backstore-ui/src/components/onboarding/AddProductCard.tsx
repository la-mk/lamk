import React, { useState } from 'react';
import {
  Card,
  UploadDragger,
  Cascader,
  UploadContent,
  Form,
  FormItem,
  Button,
  message,
  formInput,
  formTextArea,
  parsers,
  hooks,
} from '@sradevski/blocks-ui';
import { MoreOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
import { UploadChangeParam } from 'antd/es/upload';
import {
  getImageUploader,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../shared/utils/artifacts';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { GroupedCategories } from '../../state/modules/categories/categories.selector';
import { useTranslation } from 'react-i18next';
import { Store } from '@sradevski/la-sdk/dist/models/store';
import { useFullCategory, FullCategory } from '../shared/hooks/useFullCategory';
import { cascaderFilter } from '../shared/utils/form';
import { useSelector } from 'react-redux';
import { getStore } from '../../state/modules/store/store.selector';
import { ProductFormModal } from '../dashboard/products/ProductFormModal';

interface AddProductCardProps {
  storeId: Store['_id'] | undefined;
  product?: Product;
  categories: Category[] | null;
  groupedCategories: GroupedCategories | null;
  onAddProduct: (product: Product) => void;
  onPatchProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
}

export const AddProductCard = ({
  storeId,
  product,
  categories,
  groupedCategories,
  onAddProduct,
  onPatchProduct,
  onRemoveProduct,
}: AddProductCardProps) => {
  const { t } = useTranslation();
  const [fullCategory, setFullCategory] = useFullCategory(categories, product);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const store = useSelector(getStore);
  const [externalState] = hooks.useFormState<Product>(
    product,
    {
      soldBy: storeId,
      unit: sdk.product.ProductUnit.ITEM,
      images: [],
      groups: [],
    },
    [product, storeId],
  );

  if (!store) {
    return null;
  }

  return (
    <>
      <Form
        colon={false}
        validate={data => sdk.product.validate(data, Boolean(product))}
        validateSingle={sdk.product.validateSingle}
        getErrorMessage={(errorName, context) =>
          t(`errors.${errorName}`, context)
        }
        externalState={externalState}
        onFormCompleted={product ? onPatchProduct : onAddProduct}
      >
        <Card
          title={
            <FormItem mb={0} selector='name'>
              {formInput({ placeholder: t('common.name') })}
            </FormItem>
          }
          extra={
            <FormItem
              ml={3}
              mb={0}
              width='130px'
              selector='price'
              parser={parsers.number}
            >
              {formInput({
                placeholder: t('common.price'),
                addonBefore: 'Ден',
              })}
            </FormItem>
          }
          width={390}
          actions={[
            <Button
              type='link'
              onClick={() => setIsModalVisible(true)}
              icon={<MoreOutlined />}
            >
              {t('common.more')}
            </Button>,
            ...(product
              ? [
                  <Button
                    onClick={() => onRemoveProduct(product._id)}
                    type='link'
                    icon={<DeleteOutlined />}
                  >
                    {t('actions.delete')}
                  </Button>,
                ]
              : []),

            <Button htmlType='submit' type='link' icon={<CheckOutlined />}>
              {product ? t('actions.update') : t('actions.add')}
            </Button>,
          ]}
        >
          <FormItem selector='category'>
            {(_val, _onChange, onComplete) => (
              <Cascader
                options={groupedCategories!}
                onChange={value => {
                  // The cascader expects a full array of all categories, but we want to store only the last value (as the slugs should all be unique.)
                  setFullCategory(value as FullCategory);
                  onComplete(value[value.length - 1]);
                }}
                placeholder={`${t('common.polite')} ${t('actions.select')}`}
                showSearch={{ filter: cascaderFilter }}
                value={fullCategory}
              />
            )}
          </FormItem>

          <FormItem selector='images'>
            {(val, _onChange, onComplete) => (
              <UploadDragger
                multiple
                listType='picture-card'
                customRequest={getImageUploader()}
                accept='.png, .jpg, .jpeg'
                onChange={(info: UploadChangeParam) =>
                  handleArtifactUploadStatus(
                    info,
                    val,
                    false,
                    onComplete,
                    message.error,
                  )
                }
                defaultFileList={getDefaultFileList(
                  product ? product.images : [],
                  store._id,
                )}
                name='product-images'
              >
                <UploadContent
                  text={t('actions.addProductImages')}
                  hint={t('uploads.hint')}
                />
              </UploadDragger>
            )}
          </FormItem>

          <FormItem mb={0} mt={3} selector='description'>
            {formTextArea({
              placeholder: `${t('common.description')} (${t(
                'common.optional',
              )})`,
              rows: 3,
            })}
          </FormItem>
        </Card>
      </Form>
      <ProductFormModal
        product={product}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
      />
    </>
  );
};
