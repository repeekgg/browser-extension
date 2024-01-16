import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import React from 'react'
import LogoMark from './logo-mark'
import LogoType from './logo-type'

export default class extends React.Component {
  render() {
    return (
      <AppBar
        position="static"
        style={{
          background: '#171717',
          borderBottom: '1px solid #262626',
        }}
      >
        <Toolbar style={{ paddingLeft: 16, paddingRight: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <LogoMark style={{ height: 40, width: 'auto' }} />
            <LogoType style={{ height: 16, width: 'auto' }} />
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}
