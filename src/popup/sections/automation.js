import React from 'react'
import ListSubheader from '../components/list-subheader'
import ListItemSwitch from '../components/list-item-switch'

export const AUTOMATION = 'Automation'

export default ({ getSwitchProps }) => (
  <React.Fragment>
    <ListSubheader>Party</ListSubheader>
    <ListItemSwitch
      primary="Accept Invites"
      secondary="Accept party invites automatically."
      {...getSwitchProps('partyAutoAcceptInvite')}
    />
    <ListSubheader divider>Match Queue</ListSubheader>
    <ListItemSwitch
      primary="Ready Up Matches"
      secondary="Ready up for matches automatically."
      {...getSwitchProps('matchQueueAutoReady')}
    />
    <ListSubheader divider>Match Room</ListSubheader>
    <ListItemSwitch
      primary="Copy Server Data"
      secondary="Copy the server data to your clipboard automatically."
      {...getSwitchProps('matchRoomAutoCopyServerData')}
    />
    <ListItemSwitch
      primary="Connect to Server"
      secondary="Connect to the server automatically. NOTE: It's recommended to have the game started manually beforehand to avoid lags/FPS issues."
      {...getSwitchProps('matchRoomAutoConnectToServer')}
    />
    <ListItemSwitch
      primary="Veto Server Locations"
      secondary="EXPERIMENTAL: Veto server locations automatically based on your location preferences with a delay of 2 seconds, so you can still veto manually and influence the outcome."
      {...getSwitchProps('matchRoomAutoVetoLocations')}
    />
    <ListItemSwitch
      primary="Veto Maps"
      secondary="EXPERIMENTAL: Veto maps automatically based on your map preferences with a delay of 2 seconds, so you can still veto manually and influence the outcome."
      {...getSwitchProps('matchRoomAutoVetoMaps')}
    />
  </React.Fragment>
)
