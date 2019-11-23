import { Action, Reducer } from "redux";
import { CLEAR_SESSION } from "./modules/ui/ui.module";
import { purgeStoredState, persistReducer as rPersistedReducer, PersistConfig } from "redux-persist";

export const persistReducer = (storageConfig: PersistConfig, reducer: Reducer<any, Action<any>>) => {
  const persistedReducer = rPersistedReducer(storageConfig, reducer);

  return (state: any, action: Action) => {
    if(action.type === CLEAR_SESSION){
      purgeStoredState(storageConfig);
      return persistedReducer(undefined, action);
    }
  
    return persistedReducer(state, action);
  }
}
