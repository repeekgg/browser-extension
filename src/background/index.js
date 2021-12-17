import browser from 'webextension-polyfill'
import OptionsSync from 'webext-options-sync'
import semverDiff from 'semver-diff'
import storage from '../shared/storage'
import changelogs from '../changelogs'
import { DEFAULTS, UPDATE_NOTIFICATION_TYPES } from '../shared/settings'
import {
  ACTION_NOTIFICATION,
  ACTION_FETCH_BAN,
  ACTION_FETCH_VIPS,
  ACTION_FETCH_FACEIT_API
} from '../shared/constants'
import { fetchBan, fetchVips } from './api'
import faceitApi from './faceit-api'

storage.define({
  defaults: DEFAULTS,
  migrations: [
    savedOptions => {
      if (
        savedOptions.matchRoomAutoVetoMapItems &&
        savedOptions.matchRoomAutoVetoMapItems.includes('de_cache')
      ) {
        savedOptions.matchRoomAutoVetoMapItems = savedOptions.matchRoomAutoVetoMapItems.filter(
          map => map !== 'de_cache'
        )
        savedOptions.matchRoomAutoVetoMapItems.push('de_ancient')
      }
    },
    OptionsSync.migrations.removeUnused
  ]
})

browser.runtime.onMessage.addListener(async message => {
  if (!message) {
    return
  }

  switch (message.action) {
    case ACTION_NOTIFICATION: {
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
    case ACTION_FETCH_BAN: {
      try {
        const { guid } = message
        const ban = await fetchBan(guid)
        return ban
      } catch (error) {
        console.error(error)
        return null
      }
    }
    case ACTION_FETCH_VIPS: {
      try {
        const { guids } = message
        const vips = await fetchVips(guids)
        return vips
      } catch (error) {
        console.error(error)
        return null
      }
    }
    case ACTION_FETCH_FACEIT_API: {
      try {
        const { path, options } = message
        const response = await faceitApi(path, options)
        return response
      } catch (error) {
        console.error(error)
        return null
      }
    }
    default:
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
