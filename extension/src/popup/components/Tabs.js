import React from 'react'
import AppBar from 'material-ui/AppBar'
import Tabs, { Tab } from 'material-ui/Tabs'

export default ({ tabs, activeIndex, ...props }) => (
  <AppBar position="static" color="default">
    <Tabs value={activeIndex} textColor="primary" {...props}>
      {tabs.map(tab => <Tab label={tab} key={tab} />)}
    </Tabs>
  </AppBar>
)
