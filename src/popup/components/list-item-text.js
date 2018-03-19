import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'

export default ({ onClick, button, ...props }) => (
  <ListItem onClick={onClick} button={button}>
    <ListItemText {...props} />
  </ListItem>
)
