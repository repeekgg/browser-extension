import React from 'react'
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List'
import Switch from 'material-ui/Switch'

export default ({ label, onClick, checked }) => (
  <ListItem onClick={onClick} button>
    <ListItemText primary={label} />
    <ListItemSecondaryAction>
      <Switch onChange={onClick} checked={checked} />
    </ListItemSecondaryAction>
  </ListItem>
)
