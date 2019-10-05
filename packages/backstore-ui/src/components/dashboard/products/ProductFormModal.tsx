import React, { useState } from 'react';
import {
  Button,
  Flex,
  Col,
  Row,
  Select,
  Option,
  UploadDragger,
  message,
  UploadContent,
  Spin,
  Modal,
  Form,
  FormItem,
  formTextArea,
  formInput,
} from 'blocks-ui';
import { Product } from 'la-sdk/dist/models/product';
import { sdk } from 'la-sdk';
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList,
} from '../../shared/utils/artifacts';
import { useSelector } from 'react-redux';
import {
  addProduct,
  patchProduct,
} from '../../../state/modules/products/products.module';
import { getStore } from '../../../state/modules/store/store.selector';
import { useCall } from '../../shared/hooks/useCall';

interface ProductFormModalProps {
  product: Product;
  onClose: () => void;
  visible: boolean;
}

export const ProductFormModal = ({
  product,
  onClose,
  visible,
}: ProductFormModalProps) => {
  const [caller, showSpinner] = useCall();
  const store = useSelector(getStore);

  const handlePatchProduct = (product: Product) => {
    caller(sdk.product.patch(product._id, product), (product: Product) => {
      message.success(`Successfully modified ${product.name}`);
      return patchProduct(product);
    });
  };

  const handleCreateProduct = (newProduct: Product) => {
    if (store) {
      caller(
        sdk.product.create({ ...newProduct, soldBy: store._id }),
        (product: Product) => {
          message.success('Successfully added a new product');
          onClose();
          return addProduct(product);
        },
      );
    }
  };

  return (
    <Modal
      width={'80%'}
      centered
      destroyOnClose
      visible={visible}
      footer={null}
      onCancel={onClose}
      title={product ? 'Update Product' : 'Add Product'}
    >
      <Spin
        spinning={showSpinner}
        tip={`${product ? 'Updating' : 'Adding'} product...`}
      >
        <Form
          colon={false}
          externalState={product}
          validate={sdk.product.validate}
          validateSingle={sdk.product.validateSingle}
          onFormCompleted={product ? handlePatchProduct : handleCreateProduct}
          layout='horizontal'
        >
          <Row gutter={24}>
            <Col md={8} span={24}>
              <FormItem label='Name' selector='name'>
                {formInput({ placeholder: 'eg. Sneakers' })}
              </FormItem>
            </Col>

            <Col md={8} span={24}>
              <FormItem label='Category' selector='category'>
                {(val, _onChange, onComplete) => (
                  <Select
                    width='100%'
                    placeholder='Category'
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
            </Col>
            <Col md={8} span={24}>
              <FormItem label='Price' selector='price'>
                {formInput({ placeholder: 'eg. 500', addonBefore: 'Ден' })}
              </FormItem>
            </Col>
          </Row>

          <FormItem selector='images'>
            {(val, _onChange, onComplete) => (
              <UploadDragger
                multiple
                listType='picture-card'
                customRequest={uploadImage}
                accept='.png, .jpg, .jpeg'
                onChange={info =>
                  handleArtifactUploadStatus(
                    info,
                    val,
                    false,
                    onComplete,
                    message.error,
                  )
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

          <FormItem label='Product description' selector='description'>
            {formTextArea({
              placeholder: 'eg. High quality sneakers (optional)',
              rows: 3,
            })}
          </FormItem>
          <Flex mt={3} justifyContent='center'>
            <Button type='ghost' mr={2} onClick={onClose}>
              Cancel
            </Button>
            <Button ml={2} htmlType='submit' type='primary'>
              {product ? 'Update Product' : 'Add Product'}
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  );
};
