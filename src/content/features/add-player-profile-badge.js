/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'

import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'

import createFeaturedPlayerBadgeElement from '../components/player-badge'
import { getPlayerBadges } from '../helpers/badge'
import { getPlayerProfileNickname } from '../helpers/player-profile'
import { getPlayer } from '../helpers/faceit-api'

const FEATURE_ATTRIBUTE = 'profile-badge'

export default async parentElement => {
  const badgeElement = select(
    'div.page-title__content > div.page-title__content__title',
    parentElement
  )

  if (badgeElement === null) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, badgeElement)) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, badgeElement)

  const nickname = getPlayerProfileNickname()
  const player = await getPlayer(nickname)
  const playerBadges = getPlayerBadges()

  const playerBadge = playerBadges.find(({ guid }) => guid === player.guid)

  if (!playerBadge) {
    return
  }

  const featuredPlayerBadgeElement = createFeaturedPlayerBadgeElement(
    playerBadge
  )

  const badgeWrapper = <div className="mb-sm">{featuredPlayerBadgeElement}</div>

  badgeElement.insertBefore(badgeWrapper, badgeElement.firstChild)
}
