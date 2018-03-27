import React from 'react'
import ListSubheader from '../components/list-subheader'
import ListItemSwitch from '../components/list-item-switch'

export const NOTIFICATIONS = 'Notifications'

export default ({ getSwitchProps }) => (
  <React.Fragment>
    <ListSubheader>General</ListSubheader>
    <ListItemSwitch
      primary="Disable Notifications"
      secondary="All options below are ignored regardless of their setting."
      {...getSwitchProps('notifyDisabled')}
    />
    <ListSubheader divider>Party</ListSubheader>
    <ListItemSwitch
      primary="Invite Accepted"
      {...getSwitchProps('notifyPartyAutoAcceptInvite')}
    />
    <ListSubheader divider>Match Queue</ListSubheader>
    <ListItemSwitch
      primary="Match Readied Up"
      {...getSwitchProps('notifyMatchQueueAutoReady')}
    />
    <ListSubheader divider>Match Room</ListSubheader>
    <ListItemSwitch
      primary="Server Data Copied"
      {...getSwitchProps('notifyMatchRoomAutoCopyServerData')}
    />
    <ListItemSwitch
      primary="Server Connect"
      {...getSwitchProps('notifyMatchRoomAutoConnectToServer')}
    />
    <ListItemSwitch
      primary="Server Locations Veto"
      {...getSwitchProps('notifyMatchRoomAutoVetoLocations')}
    />
    <ListItemSwitch
      primary="Maps Veto"
      {...getSwitchProps('notifyMatchRoomAutoVetoMaps')}
    />
  </React.Fragment>
)
