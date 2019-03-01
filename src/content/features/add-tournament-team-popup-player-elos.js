/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { getTournament, getPlayer } from '../libs/faceit'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getTournamentId } from '../libs/tournament'
import { isModalOpen } from '../libs/utils'
import createEloElement from '../components/elo'

const FEATURE_ATTRIBUTE = 'tournament-team-popup-player-elo'

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

    const elo = player.games[game].faceitElo || '–'

    const eloElement = createEloElement({ elo, alignRight: true })

    userElement.append(<div className="text-muted text-md">{eloElement}</div>)
  })
}
