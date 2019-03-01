/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { getTournament, getPlayer, getPlayerStats } from '../libs/faceit'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle
} from '../libs/dom-element'
import { getTournamentId } from '../libs/tournament'
import { isModalOpen } from '../libs/utils'
import createPlayerStatsElement from '../components/player-stats'

const FEATURE_ATTRIBUTE = 'tournament-team-popup-player-stats'

export default async parentElement => {
  if (!isModalOpen()) {
    return
  }

  const tournamentId = getTournamentId()
  const tournament = await getTournament(tournamentId)
  const { game } = tournament

  const playerElements = select.all(
    'li[ng-repeat="member in team.members | orderByTeamMemberRole"]',
    parentElement
  )

  if (playerElements.length === 0) {
    return
  }

  playerElements.forEach(async playerElement => {
    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, playerElement)) {
      return
    }

    setFeatureAttribute(FEATURE_ATTRIBUTE, playerElement)

    const userElement = select('div[class*="users-list__item"]', playerElement)
    const nicknameElement = select(
      'strong[ng-bind="member.nickname"]',
      userElement
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

    playerElement.append(<div style={{ width: '100%' }}>{statsElement}</div>)
  })

  const userList = select('.modal-dialog .users-list')
  setStyle(userList, 'margin-bottom: 25px')
}
