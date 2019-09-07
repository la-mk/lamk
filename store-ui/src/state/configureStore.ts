import { createStore } from 'redux';
import { reducer } from './reducer';

export const makeStore = initialState => {
  return createStore(reducer, initialState);
};
