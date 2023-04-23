import { createMuiTheme } from '@material-ui/core/styles'

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
      default: '#171717'
    }
  },
  typography: {
    useNextVariants: true
  }
})
