import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

export default ({ onClickSave, saved, savedDisabled }) => (
  <AppBar position="static" color="secondary">
    <Toolbar>
      <Typography variant="title" color="primary" style={{ flex: 1 }}>
        FACEIT Enhancer
      </Typography>
      <Button variant="raised" onClick={onClickSave} disabled={savedDisabled}>
        {saved ? 'Saved' : 'Save'}
      </Button>
    </Toolbar>
  </AppBar>
)
