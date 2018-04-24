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
    <ListItemLink primary="Author" secondary="azn" faceit="azn__" />
    <ListItemLink primary="Website" href="https://faceit-enhancer.com" />
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
    <ListSubheader divider>Contributors</ListSubheader>
    <ListItemLink
      primary="DyyLN"
      secondary="Helped building the potentially gaining and losing Elo points in a match."
      faceit="DyyLN"
    />
  </React.Fragment>
)
