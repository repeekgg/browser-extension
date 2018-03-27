import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'

export default ({ href, faceit, steamCommunity, subreddit, ...props }) => {
  let link = href

  if (faceit) {
    link = `https://www.faceit.com/en/players/${faceit}`
  } else if (steamCommunity) {
    link = `http://steamcommunity.com/${steamCommunity}`
  } else if (subreddit) {
    link = `https://www.reddit.com/r/FACEITEnhancer/${
      typeof subreddit === 'string' ? subreddit : ''
    }`
  }

  return (
    <ListItem component="a" href={link} target="_blank" button>
      <ListItemText {...props} />
    </ListItem>
  )
}
