import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'

export default ({ onClick, style, button, ...props }) => (
  <ListItem onClick={onClick} button={button || Boolean(onClick)} style={style}>
    <ListItemText {...props} />
  </ListItem>
)
