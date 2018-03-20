import React from 'react'
import List from 'material-ui/List'
import browser from 'webextension-polyfill'
import { version } from '../manifest'
import changelogs from '../libs/changelogs'
import storage from '../libs/storage'
import { UPDATE_NOTIFICATION_TYPES } from '../libs/settings'
import AppBar from './components/app-bar'
import Tabs from './components/tabs'
import ListItemSwitch from './components/list-item-switch'
import ListItemLink from './components/list-item-link'
import ListItemMenu from './components/list-item-menu'
import ListSubheader from './components/list-subheader'
import ListDividerSubheader from './components/list-divider-subheader'
import Loading from './components/loading'

const UPDATE_NOTIFICATION_TYPES_MAP = {
  tab: 'Open changelog in a new unfocused tab automatically',
  badge: 'Show a badge on the extension icon and open changelog yourself',
  disabled: 'Disabled'
}

export default class App extends React.Component {
  state = {
    options: {},
    loading: true,
    activeTab: 'General'
  }

  async componentDidMount() {
    const options = await storage.getAll()
    this.setState({ options, loading: false })
  }

  onSwitchOption = value => () => {
    this.setState(({ options }) => {
      const newValue = !options[value]

      storage.set({ [value]: newValue })

      return {
        options: {
          ...options,
          [value]: newValue
        }
      }
    })
  }

  onChangeOption = value => newValue => {
    const option = { [value]: newValue }
    this.setState(({ options }) => ({
      options: {
        ...options,
        ...option
      }
    }))
    storage.set(option)
  }

  onChangeTab = (e, value) =>
    this.setState(() => ({ activeTab: this.tabs[value] }))

  onClickUpdateNotification = version => {
    this.setState(({ options }) => {
      const updateNotifications = options.updateNotifications.filter(
        updateVersion => updateVersion !== version
      )

      storage.set({ updateNotifications })

      browser.browserAction.setBadgeText({
        text:
          updateNotifications.length > 0
            ? updateNotifications.length.toString()
            : ''
      })

      return {
        options: {
          ...options,
          updateNotifications
        }
      }
    })
  }

  isActiveTab = index => this.state.activeTab === index

  tabs = ['General', 'Notifications', 'Misc', 'Help', 'Donate', 'About']

  getSwitchProps = option => ({
    onClick: this.onSwitchOption(option),
    checked: this.state.options[option]
  })

  render() {
    const { activeTab, loading } = this.state
    return (
      <React.Fragment>
        <AppBar
          showUpdateNotifications={
            this.state.options.updateNotificationType === 'badge'
          }
          updateNotifications={this.state.options.updateNotifications}
          onClickUpdateNotification={this.onClickUpdateNotification}
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
                  <ListSubheader>General</ListSubheader>
                  <ListItemSwitch
                    primary="Show Elo & Elo Progress in Header"
                    secondary="Show own level, Elo and Elo progress in the header."
                    {...this.getSwitchProps('headerShowElo')}
                  />
                  <ListSubheader>Party</ListSubheader>
                  <ListItemSwitch
                    primary="Auto Accept Invite"
                    secondary="Accept party invites automatically."
                    {...this.getSwitchProps('partyAutoAcceptInvite')}
                  />
                  <ListDividerSubheader>Match Queue</ListDividerSubheader>
                  <ListItemSwitch
                    primary="Auto Ready"
                    secondary="Ready up for matches automatically."
                    {...this.getSwitchProps('matchQueueAutoReady')}
                  />
                  <ListDividerSubheader>Match Room</ListDividerSubheader>
                  <ListItemSwitch
                    primary="Show Player Stats"
                    secondary="Show total stats (matches, win rate) & average stats (kills, headshots %, k/d, k/r) past 20 games."
                    {...this.getSwitchProps('matchRoomShowPlayerStats')}
                  />
                  <ListItemSwitch
                    primary="Auto Copy Server Data"
                    secondary="Copy server data to your clipboard automatically."
                    {...this.getSwitchProps('matchRoomAutoCopyServerData')}
                  />
                  <ListItemSwitch
                    primary="Auto Connect to Server"
                    secondary="Launch the game and connect to the server automatically (10 seconds delayed)."
                    {...this.getSwitchProps('matchRoomAutoConnectToServer')}
                  />
                  <ListItemSwitch
                    primary="Hide Player Controls"
                    secondary={
                      'Hide the bar that includes "Add Friend", game profile, "Twitch channel", "Recommend/Report" etc. Will be displayed when hovering over the player instead.'
                    }
                    {...this.getSwitchProps('matchRoomHidePlayerControls')}
                  />
                </List>
              )}
              {this.isActiveTab('Notifications') && (
                <List>
                  <ListSubheader>General</ListSubheader>
                  <ListItemSwitch
                    primary="Disable Notifications"
                    secondary="Don't show notifications. All options below are ignored regardless of their setting."
                    {...this.getSwitchProps('notifyDisabled')}
                  />
                  <ListDividerSubheader>Party</ListDividerSubheader>
                  <ListItemSwitch
                    primary="Auto Accept Invite"
                    secondary="When a party invite has been accepted."
                    {...this.getSwitchProps('notifyPartyAutoAcceptInvite')}
                  />
                  <ListDividerSubheader>Match Queue</ListDividerSubheader>
                  <ListItemSwitch
                    primary="Auto Ready"
                    secondary="When a match has been readied up for."
                    {...this.getSwitchProps('notifyMatchQueueAutoReady')}
                  />
                  <ListDividerSubheader>Match Room</ListDividerSubheader>
                  <ListItemSwitch
                    primary="Auto Copy Server Data"
                    secondary="When server data has been copied to your clipboard."
                    {...this.getSwitchProps(
                      'notifyMatchRoomAutoCopyServerData'
                    )}
                  />
                  <ListItemSwitch
                    primary="Auto Connect To Server"
                    secondary="When launching the game and connecting to the server."
                    {...this.getSwitchProps(
                      'notifyMatchRoomAutoConnectToServer'
                    )}
                  />
                </List>
              )}
              {this.isActiveTab('Misc') && (
                <List>
                  <ListSubheader>Updates</ListSubheader>
                  <ListItemMenu
                    primary="Notify about New Updates"
                    options={UPDATE_NOTIFICATION_TYPES}
                    mapOption={option => UPDATE_NOTIFICATION_TYPES_MAP[option]}
                    selected={this.state.options.updateNotificationType}
                    onChangeOption={this.onChangeOption(
                      'updateNotificationType'
                    )}
                  />
                </List>
              )}
              {this.isActiveTab('Help') && (
                <List>
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
                  <ListDividerSubheader>Donators</ListDividerSubheader>
                  <ListItemLink
                    primary="Bymas"
                    href="http://steamcommunity.com/profiles/76561198175953790/"
                  />
                  <ListItemLink
                    primary="kidi"
                    href="http://steamcommunity.com/profiles/76561198056684789/"
                  />
                </List>
              )}
              {this.isActiveTab('About') && (
                <List>
                  <ListSubheader>About</ListSubheader>
                  <ListItemLink
                    primary="Version"
                    secondary={version}
                    href={changelogs[version]}
                  />
                  <ListItemLink
                    primary="Author"
                    secondary="azn"
                    href="http://steamcommunity.com/id/azn_/"
                  />
                  <ListDividerSubheader>Contributors</ListDividerSubheader>
                  <ListItemLink
                    primary="DyyLN"
                    secondary="Helped building the potentially gaining and losing Elo points in a match."
                    href="http://steamcommunity.com/profiles/76561198164180254/"
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
