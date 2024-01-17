import browser from 'webextension-polyfill'
import { ACTION_FETCH_VIPS } from '../../shared/constants'

export async function getPlayerBadges(guids) {
  const vips = await browser.runtime.sendMessage({
    action: ACTION_FETCH_VIPS,
    guids,
  })

  return vips
}
