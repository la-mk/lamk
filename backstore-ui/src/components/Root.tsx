import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RootRouter } from './Root.router';

export const Root = () => {
  return (
    <>
      <BrowserRouter>
        <RootRouter hasFinishedOnboarding={true} />
      </BrowserRouter>
    </>
  );
};
