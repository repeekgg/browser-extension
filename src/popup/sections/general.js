import React from 'react'
import { UPDATE_NOTIFICATION_TYPES } from '../../libs/settings'
import ListSubheader from '../components/list-subheader'
import ListItemSwitch from '../components/list-item-switch'
import ListItemMenu from '../components/list-item-menu'

const UPDATE_NOTIFICATION_TYPES_MAP = {
  tab: 'Open changelog in a new unfocused tab automatically',
  badge: 'Show a badge on the extension icon and open changelog manually',
  disabled: 'Do Nothing'
}

export const GENERAL = 'General'

export default ({ getSwitchProps, getMenuProps }) => (
  <React.Fragment>
    <ListSubheader>Extension</ListSubheader>
    <ListItemSwitch
      primary="Enabled"
      secondary="FACEIT will be enhanced."
      {...getSwitchProps('extensionEnabled')}
    />
    <ListItemMenu
      primary="When Updated"
      options={UPDATE_NOTIFICATION_TYPES}
      mapOption={option => UPDATE_NOTIFICATION_TYPES_MAP[option]}
      {...getMenuProps('updateNotificationType')}
    />
  </React.Fragment>
)
