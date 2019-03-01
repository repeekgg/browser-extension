/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'

import { getTournament, getPlayer } from '../libs/faceit'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getTournamentId } from '../libs/tournament'
import { isModalOpen } from '../libs/utils'

const FEATURE_ATTRIBUTE = 'tournament-team-popup-team-elo'

export default async parentElement => {
  if (!isModalOpen()) {
    return
  }

  const userList = select('.modal-dialog .users-list', parentElement)

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, userList)) {
    return
  }

  const playerElements = select.all(
    'li[ng-repeat="member in team.members | orderByTeamMemberRole"]'
  )

  if (playerElements.length === 0) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, userList)

  const tournamentId = getTournamentId()
  const tournament = await getTournament(tournamentId)
  const { game } = tournament

  const players = await Promise.all(
    playerElements.map(playerElement => {
      const nicknameElement = select(
        'strong[ng-bind="member.nickname"]',
        playerElement
      )
      const nickname = nicknameElement.textContent
      return getPlayer(nickname)
    })
  )

  const totalElo = players
    .map(player => {
      return player.games[game].faceitElo
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue)

  const averageElo = Math.floor(totalElo / players.length)

  const eloElement = (
    <div
      className="text-muted text-md"
      style={{ 'margin-bottom': 6, 'text-align': 'center' }}
    >
      Avg. Elo: {averageElo}
    </div>
  )

  userList.before(eloElement)
}
