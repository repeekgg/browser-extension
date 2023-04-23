import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import LogoMark from './logo-mark'
import LogoType from './logo-type'

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
      <AppBar
        position="static"
        style={{
          background: '#171717',
          borderBottom: '1px solid #262626'
        }}
      >
        <Toolbar style={{ paddingLeft: 16, paddingRight: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            <LogoMark style={{ height: 40, width: 'auto' }} />
            <LogoType style={{ height: 16, width: 'auto' }} />
          </div>
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
