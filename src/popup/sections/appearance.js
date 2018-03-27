import React from 'react'
import ListSubheader from '../components/list-subheader'
import ListItemSwitch from '../components/list-item-switch'

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
    <ListItemSwitch
      primary="Show Player Stats"
      secondary="Show total stats (Matches, Win Rate) & average stats (Kills, Headshots %, K/D, K/R) from past 20 games."
      {...getSwitchProps('matchRoomShowPlayerStats')}
    />
    <ListItemSwitch
      primary="Hide Player Controls"
      secondary={
        'Hide the bar that includes "Add Friend", game profile, "Twitch channel", "Recommend/Report" etc. Will be displayed when hovering over the player instead.'
      }
      {...getSwitchProps('matchRoomHidePlayerControls')}
    />
  </React.Fragment>
)
