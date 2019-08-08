import * as React from 'react';
import { Card } from 'blocks-ui/dist/basic/Card';
import { UploadDragger } from 'blocks-ui/dist/basic/Upload';
import { Select, Option } from 'blocks-ui/dist/basic/Select';
import { UploadContent } from 'blocks-ui/dist/compound/UploadContent';
import { Product } from 'la-sdk/dist/models/product';
import { Form, FormItem } from 'blocks-ui/dist/basic/Form';
import { sdk } from 'la-sdk';
import { Button } from 'blocks-ui/dist/basic/Button';
import { UploadChangeParam } from 'antd/es/upload';
import { message } from 'blocks-ui/dist/static/message';
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../shared/utils/artifacts';
import { formInput, formTextArea } from 'blocks-ui/dist/compound/FormHelpers';

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
