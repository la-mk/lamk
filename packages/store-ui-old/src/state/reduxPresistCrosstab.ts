import { KEY_PREFIX, REHYDRATE } from 'redux-persist/lib/constants';

// Note: Copy-pasted from redux-persist-crosstab since that one doesn't compile and it's not maintained anymore. Move away from redux persist for a simpler solution
export default function(
  store: any,
  persistConfig: any,
  crosstabConfig: any = {},
) {
  const blacklist = crosstabConfig.blacklist || null;
  const whitelist = crosstabConfig.whitelist || null;
  const keyPrefix = crosstabConfig.keyPrefix || KEY_PREFIX;

  const { key }: { key: string } = persistConfig;

  window.addEventListener('storage', handleStorageEvent, false);

  function handleStorageEvent(e) {
    if (e.key && e.key.indexOf(keyPrefix) === 0) {
      if (e.oldValue === e.newValue) {
        return;
      }

      const statePartial = JSON.parse(e.newValue);

      const state = Object.keys(statePartial).reduce((state, reducerKey) => {
        if (whitelist && whitelist.indexOf(reducerKey) === -1) {
          return state;
        }
        if (blacklist && blacklist.indexOf(reducerKey) !== -1) {
          return state;
        }

        state[reducerKey] = JSON.parse(statePartial[reducerKey]);

        return state;
      }, {});

      store.dispatch({
        key: e.key.slice(keyPrefix.length),
        payload: state,
        type: REHYDRATE,
      });
    }
  }
}
