import React from 'react'
import browser from 'webextension-polyfill'
import { detect } from 'detect-browser'
import capitalize from 'lodash.capitalize'
import { name, version } from '../manifest'
import changelogs from '../libs/changelogs'
import storage from '../libs/storage'
import {
  UPDATE_NOTIFICATION_TYPES,
  MATCH_ROOM_VETO_LOCATION_REGIONS
} from '../libs/settings'
import AppBar from './components/app-bar'
import ListItemText from './components/list-item-text'
import ListItemSwitch from './components/list-item-switch'
import ListItemLink from './components/list-item-link'
import ListItemMenu from './components/list-item-menu'
import ListSubheader from './components/list-subheader'
import ListDividerSubheader from './components/list-divider-subheader'
import ListSortableItems from './components/list-sortable'
import Drawer from './components/drawer'

const userBrowser = detect()

const UPDATE_NOTIFICATION_TYPES_MAP = {
  tab: 'Open changelog in a new unfocused tab automatically',
  badge: 'Show a badge on the extension icon and open changelog manually',
  disabled: 'Do Nothing'
}

export default class App extends React.Component {
  state = {
    options: {
      matchRoomVetoLocationRegion: MATCH_ROOM_VETO_LOCATION_REGIONS[0]
    },
    loading: true
  }

  async componentDidMount() {
    const storageOptions = await storage.getAll()
    this.setState(({ options }) => ({
      options: { ...options, ...storageOptions },
      loading: false
    }))
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

  onClickUpdateNotification = async version => {
    const updateNotifications = this.state.options.updateNotifications.filter(
      updateVersion => updateVersion !== version
    )

    await storage.set({ updateNotifications })

    browser.browserAction.setBadgeText({
      text:
        updateNotifications.length > 0
          ? updateNotifications.length.toString()
          : ''
    })

    browser.tabs.create({
      url: changelogs[version]
    })
  }

  getSwitchProps = (option, onClick) => ({
    onClick: onClick
      ? () => onClick(this.onSwitchOption(option))
      : this.onSwitchOption(option),
    checked: this.state.options[option],
    key: option
  })

  menuItems = [
    'General',
    'Automation',
    'Appearance',
    'Veto Preferences',
    'Notifications',
    'Help',
    'Donate',
    'About'
  ]

  renderContent = content => {
    switch (content) {
      case 'General': {
        return (
          <React.Fragment>
            <ListSubheader>Extension</ListSubheader>
            <ListItemSwitch
              primary="Enabled"
              secondary="FACEIT will be enhanced."
              {...this.getSwitchProps('extensionEnabled')}
            />
            <ListItemMenu
              primary="When Updated"
              options={UPDATE_NOTIFICATION_TYPES}
              mapOption={option => UPDATE_NOTIFICATION_TYPES_MAP[option]}
              selected={this.state.options.updateNotificationType}
              onChangeOption={this.onChangeOption('updateNotificationType')}
            />
          </React.Fragment>
        )
      }
      case 'Automation': {
        return (
          <React.Fragment>
            <ListSubheader>Party</ListSubheader>
            <ListItemSwitch
              primary="Accept Invites"
              secondary="Accept party invites automatically."
              {...this.getSwitchProps('partyAutoAcceptInvite')}
            />
            <ListDividerSubheader>Match Queue</ListDividerSubheader>
            <ListItemSwitch
              primary="Ready Up Matches"
              secondary="Ready up for matches automatically."
              {...this.getSwitchProps('matchQueueAutoReady')}
            />
            <ListDividerSubheader>Match Room</ListDividerSubheader>
            <ListItemSwitch
              primary="Copy Server Data"
              secondary="Copy the server data to your clipboard automatically."
              {...this.getSwitchProps('matchRoomAutoCopyServerData')}
            />
            <ListItemSwitch
              primary="Connect to Server"
              secondary="Connect to the server automatically. NOTE: It's recommended to have the game started manually beforehand to avoid lags/FPS issues."
              {...this.getSwitchProps('matchRoomAutoConnectToServer')}
            />
            <ListItemSwitch
              primary="Veto Server Locations"
              secondary="EXPERIMENTAL: Veto server locations automatically based on your location preferences with a delay of 2 seconds, so you can still veto manually and influence the outcome."
              {...this.getSwitchProps('matchRoomAutoVetoLocations')}
            />
            <ListItemSwitch
              primary="Veto Maps"
              secondary="EXPERIMENTAL: Veto maps automatically based on your map preferences with a delay of 2 seconds, so you can still veto manually and influence the outcome."
              {...this.getSwitchProps('matchRoomAutoVetoMaps')}
            />
          </React.Fragment>
        )
      }
      case 'Appearance': {
        return (
          <React.Fragment>
            <ListSubheader>Header</ListSubheader>
            <ListItemSwitch
              primary="Show Level with Elo and Level Progress"
              secondary="Show current level, Elo rating and level progress with how much is needed to reach the next level."
              {...this.getSwitchProps('headerShowElo')}
            />
            <ListDividerSubheader>Match Room</ListDividerSubheader>
            <ListItemSwitch
              primary="Show Player Stats"
              secondary="Show total stats (Matches, Win Rate) & average stats (Kills, Headshots %, K/D, K/R) from past 20 games."
              {...this.getSwitchProps('matchRoomShowPlayerStats')}
            />
            <ListItemSwitch
              primary="Hide Player Controls"
              secondary={
                'Hide the bar that includes "Add Friend", game profile, "Twitch channel", "Recommend/Report" etc. Will be displayed when hovering over the player instead.'
              }
              {...this.getSwitchProps('matchRoomHidePlayerControls')}
            />
          </React.Fragment>
        )
      }
      case 'Veto Preferences': {
        return (
          <React.Fragment>
            <ListSubheader>Server Location Preferences</ListSubheader>
            <ListItemMenu
              primary="Region"
              options={MATCH_ROOM_VETO_LOCATION_REGIONS}
              selected={this.state.options.matchRoomVetoLocationRegion}
              onChangeOption={this.onChangeOption(
                'matchRoomVetoLocationRegion'
              )}
            />
            <ListItemText secondary="Sorted by favourite to least favourite. Least favourite will be vetoed first." />
            <ListSortableItems
              items={
                this.state.options.matchRoomAutoVetoLocationItems[
                  this.state.options.matchRoomVetoLocationRegion
                ]
              }
              onSorted={newItems => {
                this.setState(({ options }) => {
                  const matchRoomAutoVetoLocationItems = {
                    ...options.matchRoomAutoVetoLocationItems,
                    [options.matchRoomVetoLocationRegion]: newItems
                  }
                  storage.set({ matchRoomAutoVetoLocationItems })
                  return {
                    options: {
                      ...options,
                      matchRoomAutoVetoLocationItems
                    }
                  }
                })
              }}
            />
            <ListSubheader>Map Preferences</ListSubheader>
            <ListItemText secondary="Sorted by favourite to least favourite. Least favourite will be vetoed first." />
            <ListSortableItems
              items={this.state.options.matchRoomAutoVetoMapItems}
              onSorted={newItems => {
                const matchRoomAutoVetoMapItems = newItems

                storage.set({ matchRoomAutoVetoMapItems })

                this.setState(({ options }) => ({
                  options: {
                    ...options,
                    matchRoomAutoVetoMapItems
                  }
                }))
              }}
            />
          </React.Fragment>
        )
      }
      case 'Notifications': {
        return (
          <React.Fragment>
            <ListSubheader>General</ListSubheader>
            <ListItemSwitch
              primary="Disable Desktop Notifications"
              secondary="Don't show any desktop notifications. All options below are ignored regardless of their setting."
              {...this.getSwitchProps('notifyDisabled')}
            />
            <ListDividerSubheader>Party</ListDividerSubheader>
            <ListItemSwitch
              primary="Invite Accepted"
              {...this.getSwitchProps('notifyPartyAutoAcceptInvite')}
            />
            <ListDividerSubheader>Match Queue</ListDividerSubheader>
            <ListItemSwitch
              primary="Match Readied Up"
              {...this.getSwitchProps('notifyMatchQueueAutoReady')}
            />
            <ListDividerSubheader>Match Room</ListDividerSubheader>
            <ListItemSwitch
              primary="Server Data Copied"
              {...this.getSwitchProps('notifyMatchRoomAutoCopyServerData')}
            />
            <ListItemSwitch
              primary="Server Connect"
              {...this.getSwitchProps('notifyMatchRoomAutoConnectToServer')}
            />
            <ListItemSwitch
              primary="Map Veto"
              {...this.getSwitchProps('notifyMatchRoomAutoVetoMaps')}
            />
          </React.Fragment>
        )
      }
      case 'Help': {
        return (
          <React.Fragment>
            <ListSubheader>Issues?</ListSubheader>
            <ListItemLink
              primary="Report an Issue"
              href={encodeURI(
                `https://www.reddit.com/r/FACEITEnhancer/submit?selftext=true&text=\n\n\n---\n\nVersion: ${version}\nBrowser: ${capitalize(
                  userBrowser.name
                )} (${userBrowser.version})`
              )}
            />
            <ListDividerSubheader>Questions?</ListDividerSubheader>
            <ListItemLink
              primary="Ask the Community"
              href="https://www.reddit.com/r/FACEITEnhancer/submit?selftext=true"
            />
          </React.Fragment>
        )
      }
      case 'Donate': {
        return (
          <React.Fragment>
            <ListSubheader>Support {name}</ListSubheader>
            <ListItemText
              secondary={`If you are satisfied with ${name} and want to support the extension and further development, donations are appreciated, but never asked.`}
            />
            <ListItemLink
              primary="PayPal"
              secondary="Buy me a drink to stay hydrated during developing :)"
              href="https://paypal.me/timcheung"
            />
            <ListItemLink
              primary="paysafecard, MasterCard/VISA, Sofortueberweisung, giropay"
              secondary="Buy me a snack to stay saturated during developing :)"
              href="https://www.tipeeestream.com/azn-1/donation"
            />
            <ListItemLink
              primary="Steam Trade Offer"
              secondary="Gift me CS:GO/PUBG skins, games or whatever to have some fun beside developing :)"
              href="https://steamcommunity.com/tradeoffer/new/?partner=238736&token=IGhRvdeN"
            />
            <ListDividerSubheader>
              Thanks for Your Donations!
            </ListDividerSubheader>
            <ListItemLink
              primary="zwck"
              secondary="5 EUR"
              href="https://www.faceit.com/en/players/zwacki"
            />
            <ListItemLink
              primary="shiroatata"
              secondary="CS:GO Skins"
              href="https://www.faceit.com/en/players/hentaidemon"
            />
            <ListItemLink
              primary="kidi"
              secondary="CS:GO Skins"
              href="https://www.faceit.com/en/players/bykidi"
            />
            <ListItemLink
              primary="Bymas"
              secondary="PUBG Skins"
              href="https://www.faceit.com/en/players/Bymas"
            />
          </React.Fragment>
        )
      }
      case 'About': {
        return (
          <React.Fragment>
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
            <ListDividerSubheader>Community</ListDividerSubheader>
            <ListItemLink
              primary="Reddit"
              secondary="r/FACEITEnhancer"
              href="https://reddit.com/r/faceitenhancer"
            />
            <ListItemLink
              primary="Steam Group"
              href="http://steamcommunity.com/groups/FACEITEnhancer"
            />
            <ListDividerSubheader>Contributors</ListDividerSubheader>
            <ListItemLink
              primary="DyyLN"
              secondary="Helped building the potentially gaining and losing Elo points in a match."
              href="https://www.faceit.com/en/players/DyyLN"
            />
          </React.Fragment>
        )
      }
      default: {
        return null
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <AppBar
          showUpdateNotifications={
            this.state.options.updateNotificationType === 'badge'
          }
          updateNotifications={this.state.options.updateNotifications}
          onClickUpdateNotification={this.onClickUpdateNotification}
        />
        <Drawer
          items={this.menuItems}
          loading={this.state.loading}
          renderContent={this.renderContent}
        />
      </React.Fragment>
    )
  }
}
