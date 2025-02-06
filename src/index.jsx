import { CssBaseline, StyledEngineProvider } from '@mui/material'

import AppThemeProvider from './AppThemeProvider'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import ErrorHandler from './common/components/ErrorHandler'
import { LocalizationProvider } from './common/components/LocalizationProvider'
import NativeInterface from './common/components/NativeInterface'
import Navigation from './Navigation'
import { Provider } from 'react-redux'
import React from 'react'
import ServerProvider from './ServerProvider'
import { createRoot } from 'react-dom/client'
import preloadImages from './map/core/preloadImages'
import store from './store'

preloadImages()

const root = createRoot(document.getElementById('root'))
root.render(
  <ErrorBoundary>
    <Provider store={store}>
      <LocalizationProvider>
        <StyledEngineProvider injectFirst>
          <AppThemeProvider>
            <CssBaseline />
            <ServerProvider>
              <BrowserRouter>
                <Navigation />
              </BrowserRouter>
              <ErrorHandler />
              <NativeInterface />
            </ServerProvider>
          </AppThemeProvider>
        </StyledEngineProvider>
      </LocalizationProvider>
    </Provider>
  </ErrorBoundary>
)
