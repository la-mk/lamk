import { Modal as AntModal } from 'antd';
import { ModalProps } from 'antd/es/modal';
import 'antd/es/modal/style/index.less';

import { system } from '../system';

export const Modal = system<ModalProps>(AntModal);
