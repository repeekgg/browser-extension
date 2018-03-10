import { createMuiTheme } from 'material-ui/styles'

export const colors = {
  orange: '#f50'
}

export default createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#fff'
    },
    secondary: {
      main: colors.orange
    },
    text: {
      secondary: '#999b9d'
    },
    background: {
      default: '#1E2222'
    }
  }
})
