import 'typeface-roboto';

import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import CachingController from './CachingController';
import ErrorHandler from './common/components/ErrorHandler';
import { LocalizationProvider } from './common/components/LocalizationProvider';
import NativeInterface from './common/components/NativeInterface';
import Navigation from './Navigation';
import ServerProvider from './ServerProvider';
import SocketController from './SocketController';
import preloadImages from './map/core/preloadImages';
import store from './store';
import theme from './common/theme';

// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

preloadImages();

const base = window.location.href.indexOf('modern') >= 0 ? '/modern' : '/';

ReactDOM.render(
  (
    <Provider store={store}>
      <LocalizationProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ServerProvider>
              <BrowserRouter basename={base}>
                <SocketController />
                <CachingController />
                <Navigation />
              </BrowserRouter>
            </ServerProvider>
            <ErrorHandler />
            <NativeInterface />
          </ThemeProvider>
        </StyledEngineProvider>
      </LocalizationProvider>
    </Provider>
  ), document.getElementById('root'),
);

// serviceWorkerRegistration.register();
