import React from 'react';
import { RootRouter } from './Root.router';
import { useSelector } from 'react-redux';
import { FullScreenSpinner } from './shared/components/FullScreenSpinner';
import { getUiReady } from '../state/modules/ui/ui.selector';

export const Root = () => {
  const isUiReady = useSelector(getUiReady);
  if (!isUiReady) {
    return <FullScreenSpinner />;
  }

  return <RootRouter />;
};
