import browser from 'webextension-polyfill'
import {
  IS_PRODUCTION,
  ACTION_NOTIFICATION,
  ACTION_FETCH_VIPS,
  ACTION_FETCH_FACEIT_API,
  ACTION_FETCH_SKIN_OF_THE_MATCH
} from '../shared/constants'
import api, { fetchVips, fetchConfig } from './api'
import faceitApi from './faceit-api'

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

        const { steamIds, matchId } = message
        const response = await api('v1/skin_of_the_match', {
          searchParams: {
            steam_ids: steamIds.join(',') // eslint-disable-line camelcase
          },
          timeout: 30000
        }).json()

        if (IS_PRODUCTION && !features.skinOfTheMatchWidget) {
          return null
        }

        if (IS_PRODUCTION) {
          api.post('v1/stats', {
            json: {
              eventName: 'Skin Of The Match Viewed',
              data: {
                matchId
              }
            }
          })
        }

        return response
      } catch (error) {
        console.error(error)
        return null
      }
    }
    default:
  }
})
