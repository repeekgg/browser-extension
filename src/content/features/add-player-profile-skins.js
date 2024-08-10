import select from 'select-dom'
import browser from 'webextension-polyfill'
import { ACTION_POST_STATS_EVENT } from '../../shared/constants'
import { isFaceitNext } from '../helpers/dom-element'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getPlayer } from '../helpers/faceit-api'
import { getPlayerProfileNickname } from '../helpers/player-profile'

const FEATURE_ATTRIBUTE = 'player-profile-skins'

export default async function addPlayerProfileSkins() {
  const mainContentElement = select(
    isFaceitNext()
      ? '#main-layout-content:has(div[class*="PlayerInfo"]), div[class*="ModalContent"]:has(div[class*="PlayerInfo"])'
      : '#parasite-container[style*="display: block"], parasite-player-profile > div',
  )

  if (
    mainContentElement?.children.length !== 4 ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, mainContentElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, mainContentElement)

  const nickname = getPlayerProfileNickname()
  const player = await getPlayer(nickname)

  browser.runtime.sendMessage({
    action: ACTION_POST_STATS_EVENT,
    eventName: 'player_profile_skins_viewed',
    data: {
      user_id: player.id,
    },
  })
}
