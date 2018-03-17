import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

export default () => (
  <AppBar position="static" color="secondary">
    <Toolbar>
      <Typography variant="title" color="primary" style={{ flex: 1 }}>
        FACEIT Enhancer
      </Typography>
    </Toolbar>
  </AppBar>
)
