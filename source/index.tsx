import './theme/theme.scss';

import * as React from 'react';
import * as ReactDom from 'react-dom';

import { MainView } from './views/main';

const Providers: React.FC = ({ children }) => <>{children}</>;

const App = (
  <Providers>
    <MainView />
  </Providers>
);

const rootElement = document.getElementById('app');

ReactDom.render(App, rootElement);
