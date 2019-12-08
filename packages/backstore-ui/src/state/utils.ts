import { Action, Reducer } from 'redux';
import { CLEAR_SESSION } from './modules/ui/ui.module';
import { purgeStoredState, persistReducer, PersistConfig } from 'redux-persist';

export const enhanceReducer = (
  reducer: Reducer<any, Action<any>>,
  storageConfig?: PersistConfig,
) => {
  const enhancedReducer = storageConfig
    ? persistReducer(storageConfig, reducer)
    : reducer;

  return (state: any, action: Action) => {
    if (action.type === CLEAR_SESSION) {
      if (storageConfig) {
        purgeStoredState(storageConfig);
      }

      return enhancedReducer(undefined, action);
    }

    return enhancedReducer(state, action);
  };
};
