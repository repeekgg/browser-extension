import React from 'react'
import ListItemSwitch from '../components/list-item-switch'
import ListSubheader from '../components/list-subheader'

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
