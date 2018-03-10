import React from 'react'
import List from 'material-ui/List'
import AppBar from './components/AppBar'
import Tabs from './components/Tabs'
import ListItemSwitch from './components/ListItemSwitch'
import ListItemLink from './components/ListItemLink'
import ListItemText from './components/ListItemText'
import ListSubheader from './components/ListSubheader'
import Loading from './components/Loading'
import storage from '../libs/storage'
import { version } from '../manifest'

export default class App extends React.Component {
  state = {
    options: {},
    loading: true,
    edited: false,
    saved: false,
    activeTab: 'General'
  }

  async componentDidMount() {
    const options = await storage.get()
    this.setState({ options, loading: false })
  }

  onSwitchOption = value => () => {
    this.setState(({ options }) => ({
      options: {
        ...options,
        [value]: !options[value]
      },
      edited: true,
      saved: false
    }))
  }

  onSave = () => {
    chrome.storage.sync.set(this.state.options, () =>
      this.setState({ saved: true, edited: false })
    )
  }

  onChangeTab = (e, value) =>
    this.setState(() => ({ activeTab: this.tabs[value] }))

  isActiveTab = index => this.state.activeTab === index

  tabs = ['General', 'Advanced', 'Help']

  render() {
    const { activeTab, loading, edited, saved } = this.state
    return (
      <React.Fragment>
        <AppBar
          onClickSave={this.onSave}
          saved={saved}
          savedDisabled={!edited}
        />
        {loading ? (
          <Loading />
        ) : (
          <React.Fragment>
            <Tabs
              tabs={this.tabs}
              activeIndex={this.tabs.indexOf(activeTab)}
              onChange={this.onChangeTab}
            />
            <div style={{ flex: 1, overflow: 'scroll' }}>
              {this.isActiveTab('General') && (
                <List>
                  <ListSubheader>Party</ListSubheader>
                  <ListItemSwitch
                    primary="Auto Accept Invite"
                    onClick={this.onSwitchOption('autoAcceptPartyInvite')}
                    checked={this.state.options.autoAcceptPartyInvite}
                  />
                  <ListSubheader>Match</ListSubheader>
                  <ListItemSwitch
                    primary="Auto Ready"
                    onClick={this.onSwitchOption('autoReadyMatch')}
                    checked={this.state.options.autoReadyMatch}
                  />
                </List>
              )}
              {this.isActiveTab('Advanced') && (
                <List>
                  <ListSubheader>Developers</ListSubheader>
                  <ListItemSwitch
                    primary="Debugging"
                    secondary="Show logs in console"
                    onClick={this.onSwitchOption('debug')}
                    checked={this.state.options.debug}
                  />
                </List>
              )}
              {this.isActiveTab('Help') && (
                <List>
                  <ListSubheader>About</ListSubheader>
                  <ListItemText primary="Version" secondary={version} />
                  <ListSubheader>Channels</ListSubheader>
                  <ListItemLink
                    primary="Reddit"
                    secondary="r/FACEITEnhancer"
                    href="https://reddit.com/r/faceitenhancer"
                  />
                  <ListItemLink
                    primary="Steam Group"
                    href="http://steamcommunity.com/groups/FACEITEnhancer"
                  />
                  <ListSubheader>Donate</ListSubheader>
                  <ListItemLink
                    primary="Buy me a drink"
                    secondary="PayPal.me"
                    href="https://paypal.me/timcheung"
                  />
                  <ListItemLink
                    primary="Equip me with CS:GO skins"
                    secondary="Steam Trade Offer"
                    href="https://steamcommunity.com/tradeoffer/new/?partner=238736&token=IGhRvdeN"
                  />
                </List>
              )}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}
