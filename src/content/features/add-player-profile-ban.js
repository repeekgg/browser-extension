/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'

import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'

import createPlayerBansElement from '../components/player-bans'
import { getPlayerProfileNickname } from '../helpers/player-profile'
import { getPlayer, getPlayerBans } from '../helpers/faceit-api'

const FEATURE_ATTRIBUTE = 'profile-bans'

export default async parentElement => {
  const banElement = select('profile-overview-bans', parentElement)

  if (banElement === null) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, banElement)) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, banElement)

  const headerElement = (
    <h3 className="heading-border">
      <span translate="BANS">Bans</span>
    </h3>
  )

  const noBanElement = <div>No match bans yet</div>

  const nickname = getPlayerProfileNickname()
  const { guid } = await getPlayer(nickname)

  const playerBans = await getPlayerBans(guid)

  if (playerBans.length === 0) {
    banElement.append(noBanElement)
  }

  playerBans.forEach(async ban => {
    const playerBansElement = createPlayerBansElement(ban)

    const banWrapper = <div className="mb-sm">{playerBansElement}</div>

    banElement.append(banWrapper)
  })

  const headerElementMissing = select('h3.heading-border', parentElement)
  if (headerElementMissing === null) {
    banElement.insertBefore(headerElement, banElement.firstChild)
  }
}
