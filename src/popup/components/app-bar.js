import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

export default class extends React.Component {
  state = {
    anchorEl: null
  }

  onCloseMenu = () => this.setState({ anchorEl: null })

  onClickNotificationUpdates = event =>
    this.setState({ anchorEl: event.currentTarget })

  render() {
    const {
      updateNotifications = [],
      showUpdateNotifications,
      onClickUpdateNotification
    } = this.props
    const { anchorEl } = this.state

    return (
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" color="primary" style={{ flex: 1 }}>
            FACEIT Enhancer
          </Typography>
          {showUpdateNotifications && (
            <React.Fragment>
              <Button
                variant="raised"
                disabled={!updateNotifications.length}
                onClick={this.onClickNotificationUpdates}
              >
                {updateNotifications.length} new Update
                {updateNotifications.length !== 1 && 's'}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.onCloseMenu}
              >
                {updateNotifications.map(version => (
                  <MenuItem
                    key={version}
                    onClick={() => onClickUpdateNotification(version)}
                  >
                    v{version}
                  </MenuItem>
                ))}
              </Menu>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    )
  }
}
