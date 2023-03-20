import React from 'dom-chef'
import select from 'select-dom'

import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'

import createFeaturedPlayerBadgeElement from '../components/player-badge'
import { getPlayerBadges } from '../helpers/player-badges'
import { getPlayerProfileNickname } from '../helpers/player-profile'
import { getPlayer } from '../helpers/faceit-api'

const FEATURE_ATTRIBUTE = 'profile-badge'

export default async parentElement => {
  const playerBanner = select('parasite-player-banner', parentElement)

  if (!playerBanner || !playerBanner.shadowRoot) {
    return
  }

  const playerNameElement = select('h5[size="5"]', playerBanner.shadowRoot)

  if (!playerNameElement || !playerNameElement.parentElement) {
    return
  }

  const wrapper = playerNameElement.parentElement.parentElement

  if (!wrapper) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, wrapper)) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, wrapper)

  const nickname = getPlayerProfileNickname()
  const player = await getPlayer(nickname)
  const playerBadge = await getPlayerBadges(player.id)

  if (!playerBadge) {
    return
  }

  const featuredPlayerBadgeElement = createFeaturedPlayerBadgeElement(
    playerBadge
  )

  const badgeWrapper = (
    <div
      style={{
        marginBottom: '.5em',
        marginTop:
          wrapper.firstElementChild === playerNameElement.parentElement
            ? undefined
            : '.5em'
      }}
    >
      {featuredPlayerBadgeElement}
    </div>
  )

  wrapper.insertBefore(badgeWrapper, playerNameElement.parentElement)
}
