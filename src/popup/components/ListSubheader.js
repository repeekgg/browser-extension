import React from 'react'
import ListSubheader from 'material-ui/List/ListSubheader'
import { colors } from '../theme'

export default props => (
  <ListSubheader style={{ color: colors.orange }} disableSticky {...props} />
)
