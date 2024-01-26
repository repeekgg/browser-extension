import CssBaseline from '@material-ui/core/CssBaseline'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import theme from './theme'

const rootElement = document.querySelector('#root')

if (rootElement) {
  createRoot(rootElement).render(
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>,
  )
}
