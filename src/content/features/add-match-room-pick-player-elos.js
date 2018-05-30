/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { getMatch, getPlayer } from '../libs/faceit'
import { getTeamElements, getRoomId } from '../libs/match-room'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import createEloElement from '../components/elo'

const FEATURE_ATTRIBUTE = 'pick-player-elo'

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

    const nicknameElement = select(
      'div[ng-bind="::player.nickname"]',
      playerPickElement
    )
    const nickname = nicknameElement.textContent

    const player = await getPlayer(nickname)

    if (!player) {
      return
    }

    const elo = player.games[game].faceitElo || '–'

    const eloElement = createEloElement({ elo })

    nicknameElement.append(
      <div className="text-muted text-md">{eloElement}</div>
    )
  })
}
