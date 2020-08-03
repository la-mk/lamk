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

export const VariantFormItems = ({
  hasVariants,
  t,
}: {
  hasVariants: boolean;
  t: TFunction;
}) => {
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
                    {(
                      val: any,
                      _onChange: (val: any) => void,
                      onComplete: (val: any) => void,
                    ) => {
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
                  {(
                    val: any,
                    onChange: (val: any) => void,
                    onComplete: (val: any) => void,
                  ) => {
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
                  {(
                    val: any,
                    onChange: (val: any) => void,
                    onComplete: (val: any) => void,
                  ) => {
                    return (
                      <InputNumber
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
            </Row>

            <Row gutter={24}>
              <Col md={12} span={24}>
                <FormItem
                  help={t('product.stockTip')}
                  label={t('product.stock')}
                  selector={`variants[${index}].stock`}
                  parser={parsers.integer}
                >
                  {(
                    val: any,
                    onChange: (val: any) => void,
                    onComplete: (val: any) => void,
                  ) => {
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
