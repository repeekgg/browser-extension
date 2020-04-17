/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'

import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'

import createFeaturedPlayerBadgeElement from '../components/player-badge'
import { addVIP, defaultProfiles } from '../helpers/badge'
import { getPlayerProfileNickname } from '../helpers/player-profile'
import { getPlayer } from '../helpers/faceit-api'
import store from '../store'

const FEATURE_ATTRIBUTE = 'profile-badge'

let playerBadges

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

  if (!playerBadges) {
    const vips = store.get('vips')

    playerBadges = [...defaultProfiles, ...vips.map(addVIP)]
  }

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
