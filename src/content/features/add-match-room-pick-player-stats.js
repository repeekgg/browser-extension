/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { getMatch, getPlayer, getPlayerStats } from '../helpers/faceit'
import { getTeamElements, getRoomId } from '../helpers/match-room'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle
} from '../helpers/dom-element'
import createPlayerStatsElement from '../components/player-stats'

const FEATURE_ATTRIBUTE = 'pick-player-stats'

export default async parentElement => {
  const { isTeamV1Element } = getTeamElements(parentElement)

  if (isTeamV1Element) {
    return
  }

  const captainPickElement = select(
    `div.match-voting[ng-include="vm.templates.captainPick"] ul`,
    parentElement
  )

  if (!captainPickElement) {
    return
  }

  const roomId = getRoomId()
  const { game } = await getMatch(roomId)

  const playerPickElements = select.all(
    'li[ng-repeat*="player"]',
    captainPickElement
  )

  playerPickElements.forEach(async playerPickElement => {
    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, playerPickElement)) {
      return
    }

    setFeatureAttribute(FEATURE_ATTRIBUTE, playerPickElement)

    setStyle(playerPickElement, 'flex-wrap: wrap')

    const nicknameElement = select(
      'div[ng-bind="::player.nickname"]',
      playerPickElement
    )
    const nickname = nicknameElement.textContent

    const player = await getPlayer(nickname)

    if (!player) {
      return
    }

    const { guid } = player
    const stats = await getPlayerStats(guid, game)

    if (!stats) {
      return
    }

    const statsElement = createPlayerStatsElement(stats)

    playerPickElement.append(
      <div style={{ width: '100%' }}>{statsElement}</div>
    )
  })
}
