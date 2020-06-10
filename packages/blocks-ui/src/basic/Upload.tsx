import { Upload as AntUpload } from 'antd';
import { UploadProps } from 'antd/es/upload';
import 'antd/es/upload/style/index.less';

import { system } from '../system';

export const Upload = system<UploadProps>(AntUpload);
export const UploadDragger = system<UploadProps>(AntUpload.Dragger);
