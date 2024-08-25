import React from 'dom-chef'
import select from 'select-dom'
import createFeaturedPlayerBadgeElement from '../components/player-badge'
import { isFaceitNext } from '../helpers/dom-element'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getPlayer } from '../helpers/faceit-api'
import { getPlayerBadges } from '../helpers/player-badges'
import { getPlayerProfileNickname } from '../helpers/player-profile'

const FEATURE_ATTRIBUTE = 'profile-badge'

export default async (isPlayerProfileModal) => {
  const playerInfoElement = select(
    isFaceitNext()
      ? 'div[class*="PlayerInfo__Container"]'
      : `${
          isPlayerProfileModal
            ? 'parasite-player-profile > div'
            : '#parasite-container > div > div'
        } div:has(> span + div > div + div)`,
  )

  if (
    !playerInfoElement ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, playerInfoElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, playerInfoElement)

  const nickname = getPlayerProfileNickname()
  const player = await getPlayer(nickname)
  const playerBadge = await getPlayerBadges(player.id)

  if (!playerBadge) {
    return
  }

  const playerBadgeElement = createFeaturedPlayerBadgeElement(playerBadge)

  playerInfoElement.insertAdjacentElement('afterbegin', playerBadgeElement)
}
