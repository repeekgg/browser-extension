import React from 'react'
import ListSubheader from '../components/list-subheader'
import ListItemSwitch from '../components/list-item-switch'
import ListItemLink from '../components/list-item-link'

export const APPEARANCE = 'Appearance'

export default ({ getSwitchProps }) => (
  <React.Fragment>
    <ListSubheader>Header</ListSubheader>
    <ListItemSwitch
      primary="Show Own Level Progress"
      secondary="Show own level, Elo, level progress and how much is needed to reach the next level."
      {...getSwitchProps('headerShowElo')}
    />
    <ListSubheader divider>Player Profile</ListSubheader>
    <ListItemSwitch
      primary="Show Level Progress"
      secondary="Show level, Elo, level progress and how much is needed to reach the next level."
      {...getSwitchProps('playerProfileLevelProgress')}
    />
    <ListSubheader divider>Match Room</ListSubheader>
    <ListItemLink
      primary="Show Player Stats"
      secondary={
        'This feature got implemented natively by FACEIT and can be configured in your CS:GO game settings under "Show extended statistics in the matchroom" on FACEIT.'
      }
      href="https://www.faceit.com/en/settings/games"
    />
    <ListItemSwitch
      primary="Focus Mode"
      secondary="Hide all players and focus only on the match like a pro. Players are shown when the match is finished. All other match room settings are ignored regardless of their setting."
      {...getSwitchProps('matchRoomFocusMode')}
    />
    <ListSubheader divider>Team page</ListSubheader>
    <ListItemSwitch
      primary="Detailed Team Information"
      secondary="Show detailed roster information about team."
      {...getSwitchProps('teamRosterPlayersInfo')}
    />
    <ListSubheader divider>Other page elements</ListSubheader>
    <ListItemSwitch
      primary="Hide FACEIT Client download banner"
      secondary={`Hide the orange banner that says "THE FACEIT CLIENT HAS LANDED, DOWNLOAD IT NOW"`}
      {...getSwitchProps('hideFaceitClientHasLandedBanner')}
    />
  </React.Fragment>
)
