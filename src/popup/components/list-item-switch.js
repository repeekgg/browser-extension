import React from 'react'
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List'
import Switch from 'material-ui/Switch'

export default ({ onClick, checked, ...props }) => (
  <ListItem onClick={onClick} button>
    <ListItemText {...props} style={{ paddingRight: 60 }} />
    <ListItemSecondaryAction>
      <Switch onChange={onClick} checked={checked} />
    </ListItemSecondaryAction>
  </ListItem>
)
