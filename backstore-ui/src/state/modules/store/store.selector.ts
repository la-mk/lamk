export const getStore = (state: any) => {
  const store = state.store;

  // Return any async data together with a state object so we can deal with all errors and spinners in a standardized manner.
  return {
    data: store.store,
    state: {
      getting: store.isProcessingStore,
      errorGetting: store.errorStore,
    },
  };
};
