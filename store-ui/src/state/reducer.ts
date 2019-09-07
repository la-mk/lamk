export const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_STORE':
      return { ...state, store: action.payload };
    default:
      return state;
  }
};
