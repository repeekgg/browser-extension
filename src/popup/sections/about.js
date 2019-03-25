import React from 'react'
import changelogs from '../../libs/changelogs'
import { version } from '../../manifest'
import ListSubheader from '../components/list-subheader'
import ListItemLink from '../components/list-item-link'

export const ABOUT = 'About'

export default () => (
  <React.Fragment>
    <ListSubheader>About</ListSubheader>
    <ListItemLink
      primary="Version"
      secondary={version}
      href={changelogs[version]}
    />
    <ListItemLink
      primary="Website"
      secondary="faceit-enhancer.com"
      href="https://faceit-enhancer.com"
    />
    <ListItemLink
      primary="GitHub"
      secondary="Source Code"
      href="https://github.com/faceit-enhancer/faceit-enhancer"
    />
    <ListSubheader divider>Community</ListSubheader>
    <ListItemLink primary="Reddit" secondary="r/FACEITEnhancer" subreddit />
    <ListItemLink
      primary="Steam Group"
      steamCommunity="groups/FACEITEnhancer"
    />
    <ListSubheader divider>Team</ListSubheader>
    <ListItemLink primary="azn" secondary="Creator" faceit="azn__" />
    <ListItemLink
      primary="poacher2k"
      secondary="Developer"
      faceit="poacher2k"
    />
  </React.Fragment>
)
