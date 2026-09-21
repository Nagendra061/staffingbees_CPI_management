/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import AppShell from './components/AppShell';

export default function App() {
  return (
    <Provider store={store}>
      <AppShell />
    </Provider>
  );
}

