import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Form, FormItem, FormList } from './Form';
import { Provider } from '../Provider';
import { formInput, parsers } from '../../compound/FormHelpers';
import { Flex } from '../Flex';
import { Button } from '../Button';

storiesOf('Form', module)
  .add('basic form', () => (
    <Provider>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout="horizontal"
        colon={false}
        onFormCompleted={console.log}
        externalState={{}}
        validate={() => null}
        validateSingle={() => null}
      >
        <FormItem
          extra={'Some explanation'}
          selector="price"
          label={'Price'}
          parser={parsers.number}
        >
          {formInput({ placeholder: '500', addonBefore: 'Yen' })}
        </FormItem>

        <FormItem
          extra={'Delivery destination'}
          selector="delivery"
          label={'Delivery'}
        >
          {formInput()}
        </FormItem>

        <Flex justifyContent="center" alignItems="center">
          <Button mr={2} type="primary" htmlType="submit" size="large">
            Save
          </Button>
        </Flex>
      </Form>
    </Provider>
  ))
  .add('list form', () => (
    <Provider>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
        layout="horizontal"
        colon={false}
        onFormCompleted={console.log}
        externalState={{ variants: [{}] }}
        validate={() => ({'variants': {message: "The list can have its own error", name: 'valid'}})}
        validateSingle={() => null}
      >
        <FormList
          selector="variants"
          as="tab"
          getItemTitle={entry => `hey-${entry.sku ?? ''}`}
          getDefaults={() => ({
            price: 10,
          })}
        >
          {(_entry, index) => {
            return (
              <>
                <FormItem selector={`variants[${index}].sku`} label={'SKU'}>
                  {formInput({ placeholder: 'abb11' })}
                </FormItem>

                <FormItem
                  extra={'Some explanation'}
                  selector={`variants[${index}].price`}
                  label={'Price'}
                  parser={parsers.number}
                >
                  {formInput({ placeholder: '500', addonBefore: 'Yen' })}
                </FormItem>

                <FormItem
                  selector={`variants[${index}].discount`}
                  label={'Discount'}
                  parser={parsers.number}
                >
                  {formInput({ placeholder: '100', addonBefore: 'Yen' })}
                </FormItem>
              </>
            );
          }}
        </FormList>

        <Flex justifyContent="center" alignItems="center">
          <Button mr={2} type="primary" htmlType="submit" size="large">
            Save
          </Button>
        </Flex>
      </Form>
    </Provider>
  ));
