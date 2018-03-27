import React from 'react'
import { withStyles } from 'material-ui/styles'
import MUIDrawer from 'material-ui/Drawer'
import List from 'material-ui/List'
import ListItemText from './list-item-text'
import Loading from './loading'

class Drawer extends React.Component {
  state = {
    activeItem: Object.keys(this.props.items)[0]
  }

  render() {
    const { classes, loading, items, itemProps } = this.props
    const { activeItem } = this.state

    return (
      <div style={{ display: 'flex', overflow: 'hidden' }}>
        <MUIDrawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
          <List>
            {Object.keys(items).map(item => (
              <ListItemText
                key={item}
                primary={item}
                onClick={() => {
                  this.setState({ activeItem: item })
                }}
                style={activeItem === item ? { background: '#3F3F42' } : null}
              />
            ))}
          </List>
        </MUIDrawer>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? <Loading /> : <List>{items[activeItem](itemProps)}</List>}
        </div>
      </div>
    )
  }
}

const styles = () => ({
  drawerPaper: {
    position: 'relative',
    width: 190,
    background: '#1A1A1D',
    border: 'none'
  }
})

export default withStyles(styles)(Drawer)
