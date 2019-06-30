import { default as AntForm, FormProps, FormItemProps } from 'antd/es/form';
import 'antd/lib/form/style/index.less';

import { system } from '../system';

export const Form = system<FormProps>(AntForm);
export const FormItem = system<FormItemProps>(AntForm.Item as any);
