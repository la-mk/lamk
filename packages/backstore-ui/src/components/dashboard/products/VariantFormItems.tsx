import round from 'lodash/round';
import React from 'react';
import {
  Row,
  Col,
  FormItem,
  FormList,
  parsers,
  InputNumber,
  formInput,
  PickerBoxes,
  InputGroup,
  Select,
  Option,
  Input,
} from '@sradevski/blocks-ui';
import { TFunction } from 'i18next';
import { VariantName } from '../../shared/components/VariantName';

const COLORS = [
  '#FF0000',
  '#800000',
  '#0000FF',
  '#FFFF00',
  '#FFD700',
  '#FFA500',
  '#008000',
  '#800080',
  '#000080',
  '#654321',
  '#FFC0CB',
  '#FFFFFF',
  '#000000',
  '#C0C0C0',
  '#808080',
];

enum DiscountInputMode {
  percentage,
  value,
}

export const VariantFormItems = ({
  hasVariants,
  t,
}: {
  hasVariants: boolean;
  t: TFunction;
}) => {
  const [discountInputMode, setDiscountInputMode] = React.useState<
    DiscountInputMode
  >(DiscountInputMode.percentage);

  return (
    <FormList
      as='tab'
      selector='variants'
      min={1}
      max={hasVariants ? 63 : 1}
      getItemTitle={entry =>
        hasVariants ? <VariantName t={t} attributes={entry.attributes} /> : null
      }
      getDefaults={() => ({ price: 0 })}
    >
      {(_entry, index) => {
        return (
          <>
            {hasVariants && (
              <Row gutter={24}>
                <Col md={12} span={24}>
                  <FormItem
                    label={t('attributes.color')}
                    selector={`variants[${index}].attributes.color`}
                  >
                    {(val, _onChange, onComplete) => {
                      return (
                        <PickerBoxes
                          onSelect={onComplete}
                          selected={val}
                          values={COLORS}
                          type='color'
                        />
                      );
                    }}
                  </FormItem>
                </Col>
                <Col md={12} span={24}>
                  <FormItem
                    label={t('attributes.size')}
                    selector={`variants[${index}].attributes.size`}
                  >
                    {formInput()}
                  </FormItem>
                </Col>
              </Row>
            )}
            <Row gutter={24}>
              <Col md={12} span={24}>
                <FormItem
                  label={t('common.price')}
                  selector={`variants[${index}].price`}
                  parser={parsers.number}
                >
                  {(val, onChange, onComplete) => {
                    return (
                      <InputNumber
                        placeholder={t('product.priceExample')}
                        formatter={value => {
                          return value ? `${value} ден` : '';
                        }}
                        parser={value => (value || '').replace(/[^0-9.]/g, '')}
                        width='100%'
                        min={0}
                        max={99999999}
                        decimalSeparator='.'
                        value={val}
                        onChange={onChange}
                        onBlur={() => onComplete(val)}
                      />
                    );
                  }}
                </FormItem>
              </Col>
              <Col md={12} span={24}>
                <FormItem
                  label={t('product.discount')}
                  selector={`variants[${index}].discount`}
                  parser={parsers.number}
                >
                  {(val, onChange, onComplete, state) => {
                    const variantPrice = state.variants[index]?.price ?? 0;
                    const percentageDiscount = round(
                      variantPrice === 0 ? 0 : (val / variantPrice) * 100,
                      3,
                    );

                    // TODO: Implement this with addon once ant design supports it, see https://github.com/ant-design/ant-design/issues/14284
                    return (
                      <InputGroup compact width='100%'>
                        {discountInputMode === DiscountInputMode.percentage && (
                          <InputNumber
                            width={'calc(100% - 210px)'}
                            formatter={value => {
                              return value ? `${value} %` : '';
                            }}
                            parser={value =>
                              (value || '').replace(/[^0-9.]/g, '')
                            }
                            min={0}
                            max={100}
                            decimalSeparator='.'
                            value={percentageDiscount}
                            onChange={val => {
                              const normalized = round(
                                (val as number) > 100 ? 100 : (val as number),
                                3,
                              );
                              onChange((normalized * variantPrice) / 100);
                            }}
                            onBlur={() => onComplete(val)}
                          />
                        )}

                        {discountInputMode === DiscountInputMode.value && (
                          <InputNumber
                            width={'calc(100% - 210px)'}
                            formatter={value => {
                              return value ? `${value} ден` : '';
                            }}
                            parser={value =>
                              (value || '').replace(/[^0-9.]/g, '')
                            }
                            min={0}
                            max={variantPrice}
                            decimalSeparator='.'
                            value={val}
                            onChange={val => {
                              const normalized = round(
                                (val as number) > variantPrice
                                  ? variantPrice
                                  : (val as number),
                                3,
                              );
                              onChange(normalized);
                            }}
                            onBlur={() => onComplete(val)}
                          />
                        )}
                        <Select
                          style={{ width: 90 }}
                          onChange={setDiscountInputMode}
                          value={discountInputMode}
                        >
                          <Option value={DiscountInputMode.percentage}>
                            %
                          </Option>
                          <Option value={DiscountInputMode.value}>ден</Option>
                        </Select>
                        <Input
                          width={120}
                          disabled
                          value={
                            discountInputMode === DiscountInputMode.percentage
                              ? `${val ?? 0} ден`
                              : `${percentageDiscount} %`
                          }
                        />
                      </InputGroup>
                    );
                  }}
                </FormItem>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col md={12} span={24}>
                <FormItem
                  help={t('product.stockTip')}
                  label={t('product.stock')}
                  selector={`variants[${index}].stock`}
                  parser={parsers.integer}
                >
                  {(val, onChange, onComplete) => {
                    return (
                      <InputNumber
                        width='100%'
                        min={0}
                        max={999999}
                        value={val}
                        onChange={onChange}
                        onBlur={() => onComplete(val)}
                        placeholder={t('product.stockExample')}
                      />
                    );
                  }}
                </FormItem>
              </Col>
              <Col md={12} span={24}>
                <FormItem
                  label={t('product.sku')}
                  selector={`variants[${index}].sku`}
                >
                  {formInput({
                    placeholder: t('product.skuExample'),
                  })}
                </FormItem>
              </Col>
            </Row>
          </>
        );
      }}
    </FormList>
  );
};
