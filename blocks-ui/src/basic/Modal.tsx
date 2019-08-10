import { Modal as AntModal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import 'antd/lib/modal/style/index.less';

import { system } from '../system';

export const Modal = system<ModalProps>(AntModal);
