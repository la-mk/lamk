import React, { useState, useEffect } from "react";
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
  Cascader
} from "@lamk/blocks-ui";
import { Product } from "@lamk/la-sdk/dist/models/product";
import { sdk } from "@lamk/la-sdk";
import {
  uploadImage,
  handleArtifactUploadStatus,
  getDefaultFileList
} from "../../shared/utils/artifacts";
import { useSelector } from "react-redux";
import {
  addProduct,
  patchProduct
} from "../../../state/modules/products/products.module";
import { getStore } from "../../../state/modules/store/store.selector";
import { useCall } from "../../shared/hooks/useCall";
import { setCategories } from "../../../state/modules/categories/categories.module";
import { FindResult } from "@lamk/la-sdk/dist/setup";
import { Category } from "@lamk/la-sdk/dist/models/category";
import { getCategories, getGroupedCategories } from "../../../state/modules/categories/categories.selector";

interface ProductFormModalProps {
  product: Product;
  onClose: () => void;
  visible: boolean;
}

function filter(inputValue: string, path: any[]) {
  return path.some(
    option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
  );
}

export const ProductFormModal = ({
  product,
  onClose,
  visible
}: ProductFormModalProps) => {
  const [caller, showSpinner] = useCall();
  const [fullCategoryValue, setFullCategoryValue] = useState<string[]>([]);
  const store = useSelector(getStore);
  const categories: Category[] = useSelector(getCategories);
  const groupedCategories = useSelector(getGroupedCategories);

  useEffect(() => {
    if(!categories || !product){
      return;
    }
    const categorySet = categories.find((category) => category.level3 === product.category);
    if(!categorySet){
      return;
    }

    setFullCategoryValue([categorySet.level1, categorySet.level2, categorySet.level3]);
  }, [product, categories])

  useEffect(() => {
    if (categories) {
      return;
    }

    caller(sdk.category.find(), (categories: FindResult<Category>) =>
      setCategories(categories.data)
    );
  }, [caller, categories]);

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
          message.success("Successfully added a new product");
          onClose();
          return addProduct(product);
        }
      );
    }
  };

  return (
    <Modal
      width={"80%"}
      centered
      destroyOnClose
      visible={visible}
      footer={null}
      onCancel={onClose}
      title={product ? "Update Product" : "Add Product"}
    >
      <Spin
        spinning={showSpinner}
        tip={`${product ? "Updating" : "Adding"} product...`}
      >
        <Form
          colon={false}
          externalState={product}
          validate={sdk.product.validate}
          validateSingle={sdk.product.validateSingle}
          onFormCompleted={product ? handlePatchProduct : handleCreateProduct}
          layout="horizontal"
        >
          <Row gutter={24}>
            <Col md={8} span={24}>
              <FormItem label="Name" selector="name">
                {formInput({ placeholder: "eg. Sneakers" })}
              </FormItem>
            </Col>

            <Col md={8} span={24}>
              <FormItem label="Category" selector="category">
                {(val, _onChange, onComplete) => (
                  <Cascader
                    options={groupedCategories}
                    onChange={value => {
                      // The cascader expects a full array of all categories, but we want to store only the last value (as the slugs should all be unique.)
                      setFullCategoryValue(value);
                      onComplete(value[value.length - 1]);
                    }}
                    placeholder="Please select"
                    showSearch={{ filter }}
                    value={fullCategoryValue}
                  />
                )}
              </FormItem>
            </Col>
            <Col md={8} span={24}>
              <FormItem label="Price" selector="price">
                {formInput({ placeholder: "eg. 500", addonBefore: "Ден" })}
              </FormItem>
            </Col>
          </Row>

          <FormItem selector="images">
            {(val, _onChange, onComplete) => (
              <UploadDragger
                multiple
                listType="picture-card"
                customRequest={uploadImage}
                accept=".png, .jpg, .jpeg"
                onChange={info =>
                  handleArtifactUploadStatus(
                    info,
                    val,
                    false,
                    onComplete,
                    message.error
                  )
                }
                defaultFileList={getDefaultFileList(
                  product ? product.images : undefined
                )}
                name="product-images"
              >
                <UploadContent
                  text="Add product images"
                  hint="Support for a single or bulk upload."
                />
              </UploadDragger>
            )}
          </FormItem>

          <FormItem label="Product description" selector="description">
            {formTextArea({
              placeholder: "eg. High quality sneakers (optional)",
              rows: 3
            })}
          </FormItem>
          <Flex mt={3} justifyContent="center">
            <Button type="ghost" mr={2} onClick={onClose}>
              Cancel
            </Button>
            <Button ml={2} htmlType="submit" type="primary">
              {product ? "Update Product" : "Add Product"}
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  );
};
