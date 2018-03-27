import React from 'react'
import Divider from 'material-ui/Divider'
import ListSubheader from 'material-ui/List/ListSubheader'
import { colors } from '../theme'

export default ({ divider, ...props }) => (
  <React.Fragment>
    {divider && <Divider />}
    <ListSubheader style={{ color: colors.orange }} disableSticky {...props} />
  </React.Fragment>
)
