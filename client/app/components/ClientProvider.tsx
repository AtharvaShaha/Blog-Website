'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { Toaster } from 'react-hot-toast';
import AuthInitializer from './AuthInitializer';

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
      <Toaster position="top-center" />
    </Provider>
  );
}