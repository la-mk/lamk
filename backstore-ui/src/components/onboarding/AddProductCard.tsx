import * as React from 'react';
import { Card } from '../../component-lib/basic/Card';
import { Input, TextArea } from '../../component-lib/basic/Input';
import { UploadDragger } from '../../component-lib/basic/Upload';
import { Select, Option } from '../../component-lib/basic/Select';
import { UploadContent } from '../../component-lib/compound/UploadContent';
import { Product } from '../../sdk/models/product';
import { Form, FormItem } from '../../component-lib/basic/Form';
import { sdk } from '../../sdk';
import { Button } from '../../component-lib/basic/Button';
import { UploadChangeParam } from 'antd/es/upload';
import { message } from '../../component-lib/static/message';
import { UploadFile } from 'antd/es/upload/interface';

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
  const uploadImages = async ({ file, onSuccess, onError }: any) => {
    const base64 = await sdk.artifact.toBase64(file);

    sdk.artifact
      .create({ uri: base64 })
      .then(onSuccess)
      .catch(onError);
  };

  const handleImageUploadStatus = (
    info: UploadChangeParam,
    onComplete: (val: any) => void,
    images: string[] = [],
  ) => {
    if (info.file.status === 'removed') {
      // There will be a response only if the image upload succeeded
      if (images.length > 0 && info.file.response) {
        sdk.artifact.remove(info.file.response.id);
        onComplete(images.filter(imageId => imageId !== info.file.response.id));
      }
    }

    if (info.file.status === 'done') {
      onComplete([...images, info.file.response.id]);
    }

    if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const defaultFileList = product
    ? product.images.map(
        imageId =>
          ({
            uid: imageId,
            name: imageId,
            status: 'done',
            url: sdk.artifact.getUrlForArtifact(imageId),
          } as UploadFile),
      )
    : undefined;

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
            {(val, onChange, onComplete) => (
              <Input
                placeholder='Name'
                value={val}
                onChange={onChange}
                onBlur={onComplete}
              />
            )}
          </FormItem>
        }
        extra={
          <FormItem ml={3} mb={0} width='130px' selector='price'>
            {(val, onChange, onComplete) => (
              <Input
                placeholder='Price'
                addonBefore='Ден'
                value={val}
                onChange={onChange}
                onBlur={onComplete}
              />
            )}
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
              maxTagCount={5}
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
              customRequest={uploadImages}
              accept='.png, .jpg, .jpeg'
              onChange={(info: UploadChangeParam) =>
                handleImageUploadStatus(info, onComplete, val)
              }
              defaultFileList={defaultFileList}
              name='product-images'
            >
              <UploadContent
                text='Add product images'
                hint='Support for a single or bulk upload.'
              />
            </UploadDragger>
          )}
        </FormItem>

        <FormItem mb={0} selector='description'>
          {(val, onChange, onComplete) => (
            <TextArea
              style={{ resize: 'none' }}
              rows={3}
              value={val}
              onBlur={onComplete}
              onChange={onChange}
              mt={3}
              placeholder='Product description (optional)'
            />
          )}
        </FormItem>
      </Card>
    </Form>
  );
};
