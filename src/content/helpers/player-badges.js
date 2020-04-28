/* eslint-disable import/prefer-default-export */
import browser from 'webextension-polyfill'

export async function getPlayerBadges(guids) {
  const vips = await browser.runtime.sendMessage({
    action: 'fetchVips',
    guids
  })

  return vips
}
