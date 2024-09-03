import React from 'react'
import { version } from '../../manifest'
import ListItemLink from '../components/list-item-link'
import ListItemText from '../components/list-item-text'
import ListSubheader from '../components/list-subheader'

export const ABOUT = 'About'

export default () => (
  <React.Fragment>
    <ListSubheader>About</ListSubheader>
    <ListItemText primary="Version" secondary={version} />
    <ListItemLink
      primary="Website"
      secondary="repeek.gg"
      href="https://repeek.gg"
    />
    <ListItemLink
      primary="Source Code"
      secondary="GitHub"
      href="https://github.com/repeekgg/browser-extension"
    />
    <ListSubheader divider>Community & Social</ListSubheader>
    <ListItemLink primary="Discord" href="https://rpk.gg/discord" />
    <ListItemLink
      primary="Twitter"
      href="https://twitter.com/repeekgg"
      secondary="@repeekgg"
    />
    <ListItemLink primary="Steam Group" steamCommunity="groups/repeekdotgg" />
    <ListSubheader divider>Team</ListSubheader>
    <ListItemLink
      primary="timche"
      secondary="Creator & Developer"
      twitter="timche_"
    />
  </React.Fragment>
)
