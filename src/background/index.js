import browser from 'webextension-polyfill'
import {
  ACTION_FETCH_FACEIT_API,
  ACTION_FETCH_SKIN_OF_THE_MATCH,
  ACTION_FETCH_VIPS,
  ACTION_NOTIFICATION,
  ACTION_POST_STATS_EVENT,
  IS_PRODUCTION,
} from '../shared/constants'
import {
  FACEIT_BETA_CONTENT_SCRIPT_MATCH_PATTERN,
  getHasFaceitBetaHostPermission,
  getIsFaceitBetaContentScriptRegistered,
  registerFaceitBetaContentScript,
} from '../shared/faceit-beta'
import storage from '../shared/storage'
import api, { fetchVips, fetchConfig } from './api'
import faceitApi from './faceit-api'

browser.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'update') {
    const { extensionEnabledFaceitBeta } = await storage.getAll()

    if (
      extensionEnabledFaceitBeta &&
      (await getHasFaceitBetaHostPermission()) &&
      (await getIsFaceitBetaContentScriptRegistered()) === false
    ) {
      await registerFaceitBetaContentScript()
    }
  }
})

browser.permissions.onAdded.addListener(async ({ origins }) => {
  if (origins) {
    for (const origin of origins) {
      if (
        origin === FACEIT_BETA_CONTENT_SCRIPT_MATCH_PATTERN &&
        (await getIsFaceitBetaContentScriptRegistered()) === false
      ) {
        await registerFaceitBetaContentScript()

        storage.set({
          extensionEnabledFaceitBeta: true,
        })
      }
    }
  }
})

browser.runtime.onMessage.addListener(async (message) => {
  if (!message) {
    return
  }

  switch (message.action) {
    case ACTION_NOTIFICATION: {
      const { name } = browser.runtime.getManifest()

      message.action = undefined

      browser.notifications.create('', {
        type: 'basic',
        ...message,
        contextMessage: name,
        iconUrl: 'icon.png',
      })
      break
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
    case ACTION_FETCH_SKIN_OF_THE_MATCH: {
      try {
        const { features } = await fetchConfig()

        if (IS_PRODUCTION && !features.skinOfTheMatchApi) {
          return null
        }

        const { steamIds, organizerId } = message

        const searchParams = {
          steam_ids: steamIds.join(','),
        }

        if (typeof organizerId === 'string') {
          searchParams.organizer_id = organizerId
        }

        const response = await api('v1/skin_of_the_match', {
          searchParams,
          timeout: 30000,
        }).json()

        if (IS_PRODUCTION && !features.skinOfTheMatchWidget) {
          return null
        }

        return response
      } catch (error) {
        console.error(error)
        return null
      }
    }
    case ACTION_POST_STATS_EVENT: {
      try {
        const { eventName, data } = message

        const json = {
          eventName,
          data,
        }

        if (!IS_PRODUCTION) {
          // biome-ignore lint/suspicious/noConsoleLog: Development only
          console.log('v1/stats', json)

          return
        }

        api.post('v1/stats', {
          json,
        })
      } catch (error) {
        console.error(error)
      }

      break
    }
    default:
  }
})
