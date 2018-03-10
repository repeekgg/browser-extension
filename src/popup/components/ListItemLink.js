import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'

export default ({ href, ...props }) => (
  <ListItem component="a" href={href} target="_blank" button>
    <ListItemText {...props} />
  </ListItem>
)
