import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import MUIDrawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
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
      <div style={{ display: 'flex', overflow: 'hidden', height: '100%' }}>
        <MUIDrawer variant="permanent" classes={{ paper: classes.drawerPaper }}>
          <List>
            {Object.keys(items).map(item => (
              <ListItemText
                key={item}
                primary={item}
                style={activeItem === item ? { background: '#3F3F42' } : null}
                onClick={() => {
                  this.setState({ activeItem: item })
                }}
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
    height: '100%',
    background: '#171717',
    borderRight: '1px solid #262626'
  }
})

export default withStyles(styles)(Drawer)
