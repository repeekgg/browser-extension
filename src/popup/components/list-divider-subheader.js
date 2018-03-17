import React from 'react'
import Divider from 'material-ui/Divider'
import ListSubheader from './list-subheader'

export default props => (
  <React.Fragment>
    <Divider />
    <ListSubheader {...props} />
  </React.Fragment>
)
