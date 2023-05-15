import React from 'react'
import ListSubheader from '../components/list-subheader'
import ListItemSwitch from '../components/list-item-switch'

export const GENERAL = 'General'

export default ({ getSwitchProps }) => (
  <React.Fragment>
    <ListSubheader>Extension</ListSubheader>
    <ListItemSwitch
      primary="Enabled"
      secondary="FACEIT will be enhanced."
      {...getSwitchProps('extensionEnabled')}
    />
  </React.Fragment>
)
