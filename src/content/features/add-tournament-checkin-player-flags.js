/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { getPlayer } from '../libs/faceit'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { isModalOpen } from '../libs/utils'
import createFlagElement from '../components/flag'

const FEATURE_ATTRIBUTE = 'tournament-checkin-player-flags'

export default async parentElement => {
  if (!isModalOpen()) {
    return
  }

  const playerElements = select.all('.roster .roster__member', parentElement)

  if (playerElements.length === 0) {
    return
  }

  playerElements.forEach(async playerElement => {
    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, playerElement)) {
      return
    }

    setFeatureAttribute(FEATURE_ATTRIBUTE, playerElement)

    const nicknameElement = select(
      'strong[ng-bind="::member.nickname"]',
      playerElement
    )
    const nickname = nicknameElement.textContent

    const player = await getPlayer(nickname)

    if (!player) {
      return
    }

    const country = player.country || 0

    const flagElement = createFlagElement({ country })

    nicknameElement.prepend(
      <span style={{ 'margin-right': '5px' }}>{flagElement}</span>
    )
  })
}
