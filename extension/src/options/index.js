import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';
import App from './App'
import theme from './theme'

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Reboot />
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
)
