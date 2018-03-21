import React from 'react'
import { withStyles } from 'material-ui/styles'
import MUIDrawer from 'material-ui/Drawer'
import List from 'material-ui/List'
import ListItemText from './list-item-text'
import Loading from './loading'

class Drawer extends React.Component {
  state = {
    activeItem: this.props.items[0]
  }

  render() {
    const { classes, onChange, loading, renderContent, items } = this.props

    return (
      <div style={{ display: 'flex', overflow: 'hidden' }}>
        <MUIDrawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
          <List>
            {items.map(item => (
              <ListItemText
                key={item}
                primary={item}
                onClick={() => {
                  this.setState({ activeItem: item })
                  onChange(item)
                }}
                style={
                  this.state.activeItem === item
                    ? { background: '#3F3F42' }
                    : null
                }
              />
            ))}
          </List>
        </MUIDrawer>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <Loading />
          ) : (
            <List>{renderContent(this.state.activeItem)}</List>
          )}
        </div>
      </div>
    )
  }
}

const styles = () => ({
  drawerPaper: {
    position: 'relative',
    width: 160,
    background: '#1A1A1D',
    border: 'none'
  }
})

export default withStyles(styles)(Drawer)
