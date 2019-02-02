import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Switch from '@material-ui/core/Switch'

export default ({ onClick, checked, ...props }) => (
  <ListItem button onClick={onClick}>
    <ListItemText {...props} />
    <ListItemSecondaryAction>
      <Switch checked={checked} onChange={onClick} />
    </ListItemSecondaryAction>
  </ListItem>
)
