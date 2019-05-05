import browser from 'webextension-polyfill'
import OptionsSync from 'webext-options-sync'
import semverDiff from 'semver-diff'
import storage from '../libs/storage'
import changelogs from '../libs/changelogs'
import { DEFAULTS, UPDATE_NOTIFICATION_TYPES } from '../libs/settings'

storage.define({
  defaults: DEFAULTS,
  migrations: [
    savedOptions => {
      if (
        savedOptions.matchRoomAutoVetoMapItems &&
        savedOptions.matchRoomAutoVetoMapItems.includes('de_cbble')
      ) {
        savedOptions.matchRoomAutoVetoMapItems = savedOptions.matchRoomAutoVetoMapItems.filter(
          map => map !== 'de_cbble'
        )
        savedOptions.matchRoomAutoVetoMapItems.push('de_vertigo')
      }
    },
    OptionsSync.migrations.removeUnused
  ]
})

browser.runtime.onMessage.addListener(message => {
  if (!message) {
    return
  }

  switch (message.action) {
    case 'notification': {
      const { name } = browser.runtime.getManifest()
      delete message.action

      browser.notifications.create('', {
        type: 'basic',
        ...message,
        contextMessage: name,
        iconUrl: 'icon.png'
      })
      break
    }
    case 'closeWindow': {
      browser.windows.remove(browser.windows.WINDOW_ID_CURRENT)
      break
    }
    default: {
      break
    }
  }
})

browser.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  if (reason === 'update') {
    const { installType } = await browser.management.getSelf()

    if (installType === 'development') {
      return
    }

    const { version } = browser.runtime.getManifest()

    const versionDiffType = semverDiff(previousVersion, version)
    if (versionDiffType === null || versionDiffType === 'patch') {
      return
    }

    const changelogUrl = changelogs[version]

    if (changelogUrl) {
      const {
        updateNotificationType,
        updateNotifications
      } = await storage.getAll()

      switch (updateNotificationType) {
        // Tab
        case UPDATE_NOTIFICATION_TYPES[0]: {
          browser.tabs.create({
            url: changelogUrl,
            active: false
          })
          break
        }
        // Badge
        case UPDATE_NOTIFICATION_TYPES[1]: {
          updateNotifications.push(version)
          await storage.set({ updateNotifications })
          browser.browserAction.setBadgeText({
            text: updateNotifications.length.toString()
          })
          browser.browserAction.setBadgeBackgroundColor({ color: '#f50' })
          break
        }
        default: {
          break
        }
      }
    }
  }
})
