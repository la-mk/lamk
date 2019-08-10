import { Upload as AntUpload } from 'antd';
import { UploadProps } from 'antd/lib/upload';
import 'antd/lib/upload/style/index.less';

import { system } from '../system';

export const Upload = system<UploadProps>(AntUpload as any);
export const UploadDragger = system<UploadProps>(AntUpload.Dragger as any);
