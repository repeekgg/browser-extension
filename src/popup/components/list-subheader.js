import React from 'react'
import Divider from '@material-ui/core/Divider'
import ListSubheader from '@material-ui/core/ListSubheader'

export default ({ divider, ...props }) => (
  <React.Fragment>
    {divider && <Divider />}
    <ListSubheader
      disableSticky
      style={{ color: '#fff', fontWeight: 'bold' }}
      {...props}
    />
  </React.Fragment>
)
