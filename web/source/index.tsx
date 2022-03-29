import './theme/theme.scss';

import { ModalProvider } from '@rocketmakers/armstrong-edge';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { AudioContextProvider } from '../hooks/useAudioContext';
import { OscillatorsProvider } from '../hooks/useOscillator';
import { MainView } from './views/main';

const Providers: React.FC = ({ children }) => (
  <ModalProvider>
    <AudioContextProvider>
      <OscillatorsProvider> {children}</OscillatorsProvider>
    </AudioContextProvider>
  </ModalProvider>
);

const App = (
  <Providers>
    <MainView />
  </Providers>
);

const rootElement = document.getElementById('app');

ReactDom.render(App, rootElement);
