import React from 'dom-chef'
import select from 'select-dom'
import createFeaturedPlayerBadgeElement from '../components/player-badge'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getPlayer } from '../helpers/faceit-api'
import { getPlayerBadges } from '../helpers/player-badges'
import { getPlayerProfileNickname } from '../helpers/player-profile'

const FEATURE_ATTRIBUTE = 'profile-badge'

export default async (isPlayerProfileModal) => {
  const playerNameElement = select(
    `${
      isPlayerProfileModal
        ? 'parasite-player-profile > div'
        : '#parasite-container'
    } h5[size="5"]`,
  )

  const playerMainInfoElement = playerNameElement?.parentElement?.parentElement

  if (
    !playerMainInfoElement ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, playerMainInfoElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, playerMainInfoElement)

  const nickname = getPlayerProfileNickname()
  const player = await getPlayer(nickname)
  const playerBadge = await getPlayerBadges(player.id)

  if (!playerBadge) {
    return
  }

  const playerBadgeElement = (
    <div
      style={{
        marginBottom: 4,
      }}
    >
      {createFeaturedPlayerBadgeElement(playerBadge)}
    </div>
  )

  playerMainInfoElement.prepend(playerBadgeElement)
}
