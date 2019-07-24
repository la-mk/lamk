import * as React from 'react';
import { Card } from '../../component-lib/basic/Card';
import { UploadDragger } from '../../component-lib/basic/Upload';
import { Select, Option } from '../../component-lib/basic/Select';
import { UploadContent } from '../../component-lib/compound/UploadContent';
import { Product } from '../../sdk/models/product';
import { Form, FormItem } from '../../component-lib/basic/Form';
import { sdk } from '../../sdk';
import { Button } from '../../component-lib/basic/Button';
import { UploadChangeParam } from 'antd/es/upload';
import { message } from '../../component-lib/static/message';
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../shared/utils/artifacts';
import {
  formInput,
  formTextArea,
} from '../../component-lib/compound/FormHelpers';

interface AddProductCardProps {
  product?: Product;
  onAddProduct: (product: Product) => void;
  onPatchProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
}

export const AddProductCard = ({
  product,
  onAddProduct,
  onPatchProduct,
  onRemoveProduct,
}: AddProductCardProps) => {
  return (
    <Form
      colon={false}
      validate={sdk.product.validate}
      validateSingle={sdk.product.validateSingle}
      externalState={product}
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
                  icon='check'
                >
                  Delete
                </Button>,
              ]
            : []),

          <Button htmlType='submit' type='link' icon='delete'>
            {product ? 'Update' : 'Create'}
          </Button>,
        ]}
      >
        <FormItem selector='category'>
          {(val, _onChange, onComplete) => (
            <Select
              width='100%'
              placeholder='Categories'
              showSearch
              showArrow
              onChange={onComplete}
              value={val}
            >
              <Option value='Home items'>Home items</Option>
              <Option value='Sports'>Sports</Option>
            </Select>
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
                handleArtifactUploadStatus(info, val, onComplete, message.error)
              }
              defaultFileList={getDefaultFileList(
                product ? product.images : undefined,
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
