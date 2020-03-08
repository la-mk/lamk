import sessionStorage from 'redux-persist/lib/storage/session';

import campaigns from './campaigns.module';
import { enhanceReducer } from '../../utils';

const config = {
  key: 'campaigns',
  storage: sessionStorage,
};

export default enhanceReducer(campaigns, config);
