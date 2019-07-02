import * as React from 'react';
import { Card } from '../../component-lib/basic/Card';
import { Icon } from '../../component-lib/basic/Icon';
import { Input, TextArea } from '../../component-lib/basic/Input';
import { UploadDragger } from '../../component-lib/basic/Upload';
import { Select, Option } from '../../component-lib/basic/Select';
import { UploadContent } from '../../component-lib/compound/UploadContent';

export const CreateProductCard = ({ onCreateProduct }: any) => {
  return (
    <Card
      title={<Input placeholder='Name' />}
      extra={<Input width={130} ml={3} placeholder='Price' addonAfter='Ден' />}
      width={390}
      actions={[<Icon type='more' />, <Icon type='check' />]}
    >
      <Select
        mb={3}
        width='100%'
        placeholder='Categories'
        showSearch
        maxTagCount={5}
        showArrow
      >
        <Option value='Home items'>Home items</Option>
        <Option value='Sports'>Sports</Option>
      </Select>

      <UploadDragger multiple listType='picture-card'>
        <UploadContent
          text='Add product images'
          hint='Support for a single or bulk upload.'
        />
      </UploadDragger>
      <TextArea
        style={{ resize: 'none' }}
        rows={3}
        mt={3}
        placeholder='Product description (optional)'
      />
    </Card>
  );
};
