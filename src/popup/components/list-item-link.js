import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { ExternalLink } from 'lucide-react'
import React from 'react'

export default ({
  href,
  faceit,
  steamCommunity,
  subreddit,
  twitter,
  ...props
}) => {
  let link = href

  if (faceit) {
    link = `https://www.faceit.com/en/players/${faceit}`
  } else if (steamCommunity) {
    link = `http://steamcommunity.com/${steamCommunity}`
  } else if (subreddit) {
    link = `https://www.reddit.com/r/repeekgg/${
      typeof subreddit === 'string' ? subreddit : ''
    }`
  } else if (twitter) {
    link = `https://www.twitter.com/${twitter}`
  }

  return (
    <ListItem button component="a" href={link} target="_blank">
      <ListItemText {...props} />
      <div style={{ marginLeft: 16 }}>
        <ExternalLink size={16} color="#999b9d" />
      </div>
    </ListItem>
  )
}
