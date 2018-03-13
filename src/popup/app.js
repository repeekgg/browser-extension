import React from 'react'
import List from 'material-ui/List'
import { version } from '../manifest'
import storage from '../libs/storage'
import AppBar from './components/app-bar'
import Tabs from './components/tabs'
import ListItemSwitch from './components/list-item-switch'
import ListItemLink from './components/list-item-link'
import ListItemText from './components/list-item-text'
import ListSubheader from './components/list-subheader'
import Loading from './components/loading'

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

  tabs = ['General', 'Help', 'Donate']

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
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {this.isActiveTab('General') && (
                <List>
                  <ListSubheader>Party</ListSubheader>
                  <ListItemSwitch
                    primary="Auto Accept Invite"
                    onClick={this.onSwitchOption('autoAcceptPartyInvite')}
                    checked={this.state.options.autoAcceptPartyInvite}
                  />
                  <ListSubheader>Match Queue</ListSubheader>
                  <ListItemSwitch
                    primary="Auto Ready"
                    onClick={this.onSwitchOption('autoReadyMatch')}
                    checked={this.state.options.autoReadyMatch}
                  />
                  <ListSubheader>Match Room</ListSubheader>
                  <ListItemSwitch
                    primary="Show Player Stats"
                    secondary="Matches, Win Rate, Avg. K/D, Avg. K/R, Avg. Kills (Experimental)"
                    onClick={this.onSwitchOption('matchRoom.showPlayerStats')}
                    checked={this.state.options['matchRoom.showPlayerStats']}
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
                </List>
              )}
              {this.isActiveTab('Donate') && (
                <List>
                  <ListSubheader>PayPal.Me</ListSubheader>
                  <ListItemLink
                    primary="Buy me a drink"
                    secondary="Coffee, beer or water to stay hydrated during development ;)"
                    href="https://paypal.me/timcheung"
                  />
                  <ListSubheader>Steam Trade Offer</ListSubheader>
                  <ListItemLink
                    primary="Gift me goodies"
                    secondary="CS:GO/PUBG skins, games or other stuff to have fun outside of development :)"
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
