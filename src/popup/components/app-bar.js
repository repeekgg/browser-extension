import React from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import browser from 'webextension-polyfill'
import Menu, { MenuItem } from 'material-ui/Menu'
import changelogs from '../../libs/changelogs'

export default class extends React.Component {
  state = {
    anchorEl: null
  }

  onCloseMenu = () => this.setState({ anchorEl: null })

  onClickNotificationUpdates = event =>
    this.setState({ anchorEl: event.currentTarget })

  onClickMenuItem = version => {
    browser.tabs.create({
      url: changelogs[version]
    })

    this.props.onClickUpdateNotification(version)
  }

  render() {
    const { updateNotifications = [], showUpdateNotifications } = this.props
    const { anchorEl } = this.state

    return (
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="title" color="primary" style={{ flex: 1 }}>
            FACEIT Enhancer
          </Typography>
          {showUpdateNotifications && (
            <React.Fragment>
              <Button
                variant="raised"
                onClick={this.onClickNotificationUpdates}
                disabled={!updateNotifications.length}
              >
                {updateNotifications.length} new Update{updateNotifications.length !==
                  1 && 's'}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.onCloseMenu}
              >
                {updateNotifications.map(version => (
                  <MenuItem
                    key={version}
                    onClick={() => this.onClickMenuItem(version)}
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
