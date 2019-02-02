import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from './list-item-text'

export default class ListItemMenu extends React.Component {
  state = {
    anchorEl: null
  }

  onClickListItem = event => this.setState({ anchorEl: event.currentTarget })

  onClickMenuItem = (event, index) => {
    const { options, onChangeOption } = this.props
    this.setState({ anchorEl: null }, () => onChangeOption(options[index]))
  }

  onCloseMenu = () => this.setState({ anchorEl: null })

  render() {
    const { primary, options, mapOption, selected } = this.props
    const { anchorEl } = this.state
    return (
      <React.Fragment>
        <ListItemText
          button
          primary={primary}
          secondary={mapOption ? mapOption(selected) : selected}
          onClick={this.onClickListItem}
        />
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.onCloseMenu}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option}
              selected={selected === option}
              onClick={event => this.onClickMenuItem(event, index)}
            >
              {mapOption ? mapOption(option) : option}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    )
  }
}
