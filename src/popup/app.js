import React from 'react'
import browser from 'webextension-polyfill'
import storage from '../shared/storage'
import changelogs from '../changelogs'
import { MATCH_ROOM_VETO_LOCATION_REGIONS } from '../shared/settings'
import AppBar from './components/app-bar'
import Drawer from './components/drawer'
import General, { GENERAL } from './sections/general'
import Automation, { AUTOMATION } from './sections/automation'
import Appearance, { APPEARANCE } from './sections/appearance'
import VetoPreferences, { VETO_PREFERENCES } from './sections/veto-preferences'
import Notifications, { NOTIFICATIONS } from './sections/notifications'
import Help, { HELP } from './sections/help'
import About, { ABOUT } from './sections/about'
import Donate, { DONATE } from './sections/donate'

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

  onClickUpdateNotification = async versionClicked => {
    const updateNotifications = this.state.options.updateNotifications.filter(
      updateVersion => updateVersion !== versionClicked
    )

    await storage.set({ updateNotifications })

    browser.browserAction.setBadgeText({
      text:
        updateNotifications.length > 0
          ? updateNotifications.length.toString()
          : ''
    })

    browser.tabs.create({
      url: changelogs[versionClicked]
    })
  }

  getUpdateOption = option => newValue => {
    this.setState(({ options }) => {
      const updatedOption = { [option]: newValue }
      storage.set(updatedOption)
      return {
        options: {
          ...options,
          ...updatedOption
        }
      }
    })
  }

  getMenuProps = (option, selected) => {
    const { options } = this.state
    return {
      key: option,
      selected: selected ? selected(options) : options[option],
      onChangeOption: this.getUpdateOption(option)
    }
  }

  getSortableProps = (itemsKey, getItems, onSorted) => {
    const { options } = this.state
    return {
      key: itemsKey,
      items: getItems ? getItems(options) : options[itemsKey],
      onSorted: onSorted
        ? newItems =>
            onSorted(newItems, options, this.getUpdateOption(itemsKey))
        : this.getUpdateOption(itemsKey)
    }
  }

  getHandleSwitchOption = option => () => {
    const updateOption = this.getUpdateOption(option)
    const newValue = !this.state.options[option]
    updateOption(newValue)
  }

  getSwitchProps = option => ({
    key: option,
    checked: this.state.options[option],
    onClick: this.getHandleSwitchOption(option)
  })

  render() {
    const { options, loading } = this.state
    const { updateNotificationType, updateNotifications } = options

    return (
      <React.Fragment>
        <AppBar
          showUpdateNotifications={updateNotificationType === 'badge'}
          updateNotifications={updateNotifications}
          onClickUpdateNotification={this.onClickUpdateNotification}
        />
        <Drawer
          loading={loading}
          items={{
            [GENERAL]: General,
            [AUTOMATION]: Automation,
            [APPEARANCE]: Appearance,
            [VETO_PREFERENCES]: VetoPreferences,
            [NOTIFICATIONS]: Notifications,
            [HELP]: Help,
            [DONATE]: Donate,
            [ABOUT]: About
          }}
          itemProps={{
            options,
            getSwitchProps: this.getSwitchProps,
            getMenuProps: this.getMenuProps,
            getSortableProps: this.getSortableProps
          }}
        />
      </React.Fragment>
    )
  }
}
