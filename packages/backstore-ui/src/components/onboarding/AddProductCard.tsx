import React, { useState, useEffect } from 'react';
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
} from '@lamk/blocks-ui';
import { Product } from '@lamk/la-sdk/dist/models/product';
import { sdk } from '@lamk/la-sdk';
import { UploadChangeParam } from 'antd/es/upload';
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../shared/utils/artifacts';
import { Category } from '@lamk/la-sdk/dist/models/category';
import { GroupedCategories } from '../../state/modules/categories/categories.selector';

interface AddProductCardProps {
  product?: Product;
  categories: Category[] | null;
  groupedCategories: GroupedCategories | null;
  onAddProduct: (product: Product) => void;
  onPatchProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
}

function filter(inputValue: string, path: any[]) {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}

export const AddProductCard = ({
  product,
  categories,
  groupedCategories,
  onAddProduct,
  onPatchProduct,
  onRemoveProduct,
}: AddProductCardProps) => {
  const [fullCategoryValue, setFullCategoryValue] = useState<string[]>([]);

  useEffect(() => {
    if(!categories || !product){
      return;
    }
    const categorySet = categories.find(category => category.level3 === product.category);
    if(!categorySet){
      return;
    }

    setFullCategoryValue([categorySet.level1, categorySet.level2, categorySet.level3]);
  }, [product, categories])

  return (
    <Form
      colon={false}
      validate={sdk.product.validate}
      validateSingle={sdk.product.validateSingle}
      externalState={product || {}}
      onFormCompleted={product ? onPatchProduct : onAddProduct}
    >
      <Card
        title={
          <FormItem mb={0} selector='name'>
            {formInput({ placeholder: 'Name' })}
          </FormItem>
        }
        extra={
          <FormItem ml={3} mb={0} width='130px' selector='price'>
            {formInput({ placeholder: 'Price', addonBefore: 'Ден' })}
          </FormItem>
        }
        width={390}
        actions={[
          <Button type='link' icon='more'>
            More
          </Button>,
          ...(product
            ? [
                <Button
                  onClick={() => onRemoveProduct(product._id)}
                  type='link'
                  icon='delete'
                >
                  Delete
                </Button>,
              ]
            : []),

          <Button htmlType='submit' type='link' icon='check'>
            {product ? 'Update' : 'Create'}
          </Button>,
        ]}
      >
        <FormItem selector='category'>
          {(_val, _onChange, onComplete) => (
            <Cascader
             options={groupedCategories!}
             onChange={(value) => {
               // The cascader expects a full array of all categories, but we want to store only the last value (as the slugs should all be unique.)
               setFullCategoryValue(value);
               onComplete(value[value.length - 1])}
              }
             placeholder="Please select"
             showSearch={{ filter }}
             value={fullCategoryValue}
           />
          )}
        </FormItem>

        <FormItem selector='images'>
          {(val, _onChange, onComplete) => (
            <UploadDragger
              multiple
              listType='picture-card'
              customRequest={uploadImage}
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
              )}
              name='product-images'
            >
              <UploadContent
                text='Add product images'
                hint='Support for a single or bulk upload.'
              />
            </UploadDragger>
          )}
        </FormItem>

        <FormItem mb={0} mt={3} selector='description'>
          {formTextArea({
            placeholder: 'Product description (optional)',
            rows: 3,
          })}
        </FormItem>
      </Card>
    </Form>
  );
};
