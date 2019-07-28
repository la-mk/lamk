import React from 'react';
import { Col } from '../../../component-lib/basic/Grid';
import { Button } from '../../../component-lib/basic/Button';
import { Form, FormItem } from '../../../component-lib/basic/Form';
import { Select, Option } from '../../../component-lib/basic/Select';
import { Delivery } from '../../../sdk/models/delivery';
import { sdk } from '../../../sdk';
import { Flex } from '../../../component-lib/basic/Flex';
import { formInput } from '../../../component-lib/compound/FormHelpers';
import { getDelivery } from '../../../state/modules/delivery/delivery.selector';
import { useSelector, useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { setDelivery } from '../../../state/modules/delivery/delivery.module';
import { message } from '../../../component-lib/static/message';
import { Spin } from '../../../component-lib/basic/Spin';

export const DeliveryPreferences = () => {
  const [showSpinner, setShowSpinner] = React.useState(false);
  const delivery = useSelector(getDelivery);
  const dispatch = useDispatch();

  const handleSetupDeliveryDone = (newDelivery?: Delivery) => {
    if (!newDelivery || isEqual(delivery, newDelivery)) {
      return;
    }

    setShowSpinner(true);

    sdk.delivery
      .patch(newDelivery._id, newDelivery)
      .then(delivery => {
        dispatch(setDelivery(delivery));
      })
      .catch(err => message.error(err.message))
      .finally(() => setShowSpinner(false));
  };

  return (
    <Col>
      <Spin spinning={showSpinner} tip='Updating delivery...'>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          layout='horizontal'
          colon={false}
          onFormCompleted={handleSetupDeliveryDone}
          externalState={delivery}
          validate={sdk.delivery.validate}
          validateSingle={sdk.delivery.validateSingle}
        >
          <FormItem selector='method' label='Delivery method'>
            {(val, _onChange, onComplete) => (
              <Select value={val} onChange={onComplete}>
                <Option value='none'>No delivery</Option>
                <Option value='cargo-pickup'>Pickup from Cargo</Option>
                <Option value='door-to-door'>Door to Door</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            extra='This can be the average delivery cost.'
            selector='price'
            label='Delivery cost'
          >
            {formInput({ placeholder: 'Price', addonBefore: 'Ден' })}
          </FormItem>

          <FormItem
            extra='Over what price do you want to offer free shipping?'
            selector='freeDeliveryOver'
            label='Free delivery'
          >
            {formInput({ placeholder: 'Over price', addonBefore: 'Ден' })}
          </FormItem>

          <Flex justifyContent='center' alignItems='center'>
            <Button mr={2} type='primary' htmlType='submit' size='large'>
              Update delivery
            </Button>
          </Flex>
        </Form>
      </Spin>
    </Col>
  );
};
