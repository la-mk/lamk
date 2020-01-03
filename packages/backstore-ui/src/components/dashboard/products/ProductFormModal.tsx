import React, { useEffect } from 'react';
import {
  Button,
  Flex,
  Col,
  Row,
  UploadDragger,
  message,
  UploadContent,
  Spin,
  Modal,
  Form,
  FormItem,
  formTextArea,
  formInput,
  parsers,
  Cascader,
} from '@sradevski/blocks-ui';
import { Product } from '@sradevski/la-sdk/dist/models/product';
import { sdk } from '@sradevski/la-sdk';
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
import { setCategories } from '../../../state/modules/categories/categories.module';
import { FindResult } from '@sradevski/la-sdk/dist/setup';
import { Category } from '@sradevski/la-sdk/dist/models/category';
import { useTranslation } from 'react-i18next';
import { cascaderFilter } from '../../shared/utils/form';
import {
  useFullCategory,
  FullCategory,
} from '../../shared/hooks/useFullCategory';
import { useCategories } from '../../shared/hooks/useCategories';
import { useFormState } from '../../shared/hooks/useFormState';

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  visible: boolean;
}

export const ProductFormModal = ({
  product,
  onClose,
  visible,
}: ProductFormModalProps) => {
  const { t } = useTranslation();
  const [caller, showSpinner] = useCall();
  const store = useSelector(getStore);
  const storeId = store ? store._id : undefined;
  const [categories, groupedCategories] = useCategories(t);
  const [fullCategory, setFullCategory] = useFullCategory(categories, product);
  const [externalState] = useFormState<Product>(product, { soldBy: storeId }, [
    product,
    storeId,
  ]);

  useEffect(() => {
    if (categories) {
      return;
    }

    caller<FindResult<Category>>(sdk.category.find(), categories =>
      setCategories(categories.data),
    );
  }, [caller, categories]);

  const handlePatchProduct = (product: Product) => {
    caller<Product>(sdk.product.patch(product._id, product), product => {
      message.success(
        t('product.updateProductSuccess', { productName: product.name }),
      );
      return patchProduct(product);
    });
  };

  const handleCreateProduct = (newProduct: Product) => {
    if (store) {
      caller<Product>(sdk.product.create(newProduct), product => {
        message.success(t('product.addProductSuccess'));
        onClose();
        return addProduct(product);
      });
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
      title={product ? t('actions.update') : t('actions.add')}
    >
      <Spin
        spinning={showSpinner}
        tip={
          product
            ? t('product.updatingProductTip')
            : t('product.addingProductTip')
        }
      >
        <Form
          colon={false}
          externalState={externalState}
          validate={data => sdk.product.validate(data, Boolean(product))}
          validateSingle={sdk.product.validateSingle}
          getErrorMessage={(errorName, context) =>
            t(`errors.${errorName}`, context)
          }
          onFormCompleted={product ? handlePatchProduct : handleCreateProduct}
          layout='horizontal'
        >
          <Row gutter={24}>
            <Col md={8} span={24}>
              <FormItem label={t('common.name')} selector='name'>
                {formInput({ placeholder: t('product.nameExample') })}
              </FormItem>
            </Col>

            <Col md={8} span={24}>
              <FormItem label={t('common.category')} selector='category'>
                {(val, _onChange, onComplete) => (
                  <Cascader
                    options={groupedCategories || []}
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
            </Col>
            <Col md={8} span={24}>
              <FormItem
                label={t('common.price')}
                selector='price'
                parser={parsers.number}
              >
                {formInput({
                  placeholder: t('product.priceExample'),
                  addonBefore: 'Ден',
                })}
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
                  text={t('actions.addProductImages')}
                  hint={t('uploads.hint')}
                />
              </UploadDragger>
            )}
          </FormItem>

          <FormItem label={t('common.description')} selector='description'>
            {formTextArea({
              placeholder: `${t('product.descriptionExample')} (${t(
                'common.optional',
              )})`,
              rows: 3,
            })}
          </FormItem>
          <Flex mt={3} justifyContent='center'>
            <Button type='ghost' mr={2} onClick={onClose}>
              {t('actions.cancel')}
            </Button>
            <Button ml={2} htmlType='submit' type='primary'>
              {product ? t('actions.update') : t('actions.add')}
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  );
};
