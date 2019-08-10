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
import { useDispatch } from 'react-redux';
import { addProduct } from '../../../state/modules/products/products.module';

interface ProductFormModalProps {
  product: Product;
  storeId: string;
  onClose: () => void;
  visible: boolean;
}

export const ProductFormModal = ({
  product,
  storeId,
  onClose,
  visible,
}: ProductFormModalProps) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const dispatch = useDispatch();

  const handlePatchProduct = (product: Product) => {
    setShowSpinner(true);

    sdk.product
      .patch(product._id, product)
      .then(product => {
        dispatch(addProduct(product));
        message.success(`Successfully modified ${product.name}`);
        onClose();
      })
      .catch(err => message.error(err.message))
      .finally(() => setShowSpinner(false));
  };

  const handleCreateProduct = (newProduct: Product) => {
    setShowSpinner(true);

    sdk.product
      .create({ ...newProduct, soldBy: storeId })
      .then(product => {
        dispatch(addProduct(product));
        message.success('Successfully added a new product');
        onClose();
      })
      .catch(err => message.error(err.message))
      .finally(() => setShowSpinner(false));
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
