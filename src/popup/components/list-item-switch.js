import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import React from 'react'

export default ({ onClick, checked, ...props }) => (
  <ListItem button onClick={onClick}>
    <ListItemText {...props} />
    <ListItemSecondaryAction>
      <Switch checked={checked} onChange={onClick} />
    </ListItemSecondaryAction>
  </ListItem>
)
