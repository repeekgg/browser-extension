import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

export default ({ onClick, style, button, ...props }) => (
  <ListItem button={button || Boolean(onClick)} style={style} onClick={onClick}>
    <ListItemText {...props} />
  </ListItem>
)
