import browser from 'webextension-polyfill'
import {
  IS_PRODUCTION,
  ACTION_NOTIFICATION,
  ACTION_FETCH_VIPS,
  ACTION_FETCH_FACEIT_API,
  ACTION_FETCH_SKIN_OF_THE_MATCH,
  ACTION_POST_STATS_EVENT
} from '../shared/constants'
import api, { fetchVips, fetchConfig } from './api'
import faceitApi from './faceit-api'

browser.runtime.onMessage.addListener(async (message) => {
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

        const { steamIds, organizerId } = message

        const searchParams = {
          /* eslint-disable camelcase */
          steam_ids: steamIds.join(',')
          /* eslint-enable camelcase */
        }

        if (typeof organizerId === 'string') {
          /* eslint-disable camelcase */
          searchParams.organizer_id = organizerId
          /* eslint-enable camelcase */
        }

        const response = await api('v1/skin_of_the_match', {
          searchParams,
          timeout: 30000
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
          data
        }

        if (!IS_PRODUCTION) {
          console.log('v1/stats', json)

          return
        }

        api.post('v1/stats', {
          json
        })
      } catch (error) {
        console.error(error)
      }

      break
    }
    default:
  }
})
