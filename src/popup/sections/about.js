import React from 'react'
import { version } from '../../manifest'
import ListItemLink from '../components/list-item-link'
import ListSubheader from '../components/list-subheader'

export const ABOUT = 'About'

export default () => (
  <React.Fragment>
    <ListSubheader>About</ListSubheader>
    <ListItemLink primary="Version" secondary={version} />
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
    <ListItemLink primary="Reddit" secondary="r/repeekgg" subreddit />
    <ListItemLink
      primary="Twitter"
      href="https://twitter.com/repeekgg"
      secondary="@repeekgg"
    />
    <ListItemLink primary="Steam" steamCommunity="groups/repeekdotgg" />
    <ListSubheader divider>Team</ListSubheader>
    <ListItemLink primary="azn" secondary="Creator & Developer" faceit="azn" />
  </React.Fragment>
)
