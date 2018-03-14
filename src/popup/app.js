import React from 'react'
import List from 'material-ui/List'
import browser from 'webextension-polyfill'
import { version } from '../manifest'
import changelogs from '../libs/changelogs'
import AppBar from './components/app-bar'
import Tabs from './components/tabs'
import ListItemSwitch from './components/list-item-switch'
import ListItemLink from './components/list-item-link'
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
    const options = await browser.storage.sync.get()
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

  onSave = async () => {
    await browser.storage.sync.set(this.state.options)
    this.setState({ saved: true, edited: false })
  }

  onChangeTab = (e, value) =>
    this.setState(() => ({ activeTab: this.tabs[value] }))

  isActiveTab = index => this.state.activeTab === index

  tabs = ['General', 'Help', 'Donate']

  getSwitchProps = option => ({
    onClick: this.onSwitchOption(option),
    checked: this.state.options[option]
  })

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
                    {...this.getSwitchProps('partyAutoAcceptInvite')}
                  />
                  <ListSubheader>Match Queue</ListSubheader>
                  <ListItemSwitch
                    primary="Auto Ready"
                    {...this.getSwitchProps('matchQueueAutoReady')}
                  />
                  <ListSubheader>Match Room</ListSubheader>
                  <ListItemSwitch
                    primary="Show Player Stats"
                    secondary="Matches, Win Rate, Avg. K/D, Avg. K/R, Avg. Kills (Experimental)"
                    {...this.getSwitchProps('matchRoomShowPlayerStats')}
                  />
                </List>
              )}
              {this.isActiveTab('Help') && (
                <List>
                  <ListSubheader>About</ListSubheader>
                  <ListItemLink
                    primary="Version"
                    secondary={version}
                    href={changelogs[version]}
                  />
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
                  <ListSubheader>Support the Development</ListSubheader>
                  <ListItemLink
                    primary="PayPal"
                    secondary="Buy me a drink to stay hydrated during development :)"
                    href="https://paypal.me/timcheung"
                  />
                  <ListItemLink
                    primary="Steam Trade Offer"
                    secondary="Gift me CS:GO/PUBG skins, games or whatever to have some fun beside development :)"
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
