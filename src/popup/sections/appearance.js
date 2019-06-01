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
      secondary="Show total stats (Matches, Win Rate) & average stats (Kills, Headshots %, K/D, K/R) from last 20 games."
      {...getSwitchProps('matchRoomShowPlayerStats')}
    />
    <ListItemSwitch
      primary="Hide Player Controls"
      secondary={
        'Hide the bottom bar that includes "Add Friend", game profile, "Twitch channel", "Recommend/Report" etc. Will be displayed when hovering over the player instead.'
      }
      {...getSwitchProps('matchRoomHidePlayerControls')}
    />
    <ListItemSwitch
      primary="Show Player Divisions"
      secondary="Shows the divisions in addition to levels, similar to how it used to be like before."
      {...getSwitchProps('matchRoomShowPlayerDivisions')}
    />
    <ListSubheader divider>Other page elements</ListSubheader>
    <ListItemSwitch
      primary="Hide FACEIT Client download banner"
      secondary={`Hide the orange banner that says "THE FACEIT CLIENT HAS LANDED, DOWNLOAD IT NOW"`}
      {...getSwitchProps('hideFaceitClientHasLandedBanner')}
    />
  </React.Fragment>
)
