import React from 'react'
import Divider from '@material-ui/core/Divider'
import ListSubheader from '@material-ui/core/ListSubheader'
import { colors } from '../theme'

export default ({ divider, ...props }) => (
  <React.Fragment>
    {divider && <Divider />}
    <ListSubheader disableSticky style={{ color: colors.orange }} {...props} />
  </React.Fragment>
)
