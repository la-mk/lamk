import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RootRouter } from './Root.router';

export const Root = () => (
  <div>
    <BrowserRouter>
      <RootRouter />
    </BrowserRouter>
  </div>
);
