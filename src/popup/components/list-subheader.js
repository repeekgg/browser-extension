import Divider from '@material-ui/core/Divider'
import ListSubheader from '@material-ui/core/ListSubheader'
import React from 'react'

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
