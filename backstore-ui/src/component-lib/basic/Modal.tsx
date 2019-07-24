import { default as AntModal, ModalProps } from 'antd/es/modal';
import 'antd/lib/modal/style/index.less';

import { system } from '../system';

export const Modal = system<ModalProps>(AntModal);
