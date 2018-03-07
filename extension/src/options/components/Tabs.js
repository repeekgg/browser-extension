import React from 'react'
import Tabs, { Tab } from 'material-ui/Tabs'

export default ({ tabs, activeIndex, ...props }) => (
  <Tabs value={activeIndex} textColor="primary" {...props}>
    {tabs.map(tab => <Tab label={tab} key={tab} />)}
  </Tabs>
)
