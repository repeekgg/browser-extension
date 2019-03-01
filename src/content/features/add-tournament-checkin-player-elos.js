/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { getPlayer } from '../libs/faceit'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { isModalOpen } from '../libs/utils'
import createEloElement from '../components/elo'

const FEATURE_ATTRIBUTE = 'tournament-checkin-player-elo'

export default async parentElement => {
  if (!isModalOpen()) {
    return
  }

  const playerElements = select.all('.roster .roster__member', parentElement)

  if (playerElements.length === 0) {
    return
  }

  /* Need to find a way to get the assoicated tournament or id on checkin
  const tournamentId = getTournamentId()
  const tournament = await getTournament(tournamentId)
  const { game } = tournament */

  const game = 'csgo'

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

    const elo = player.games[game].faceitElo || '–'

    const eloElement = createEloElement({ elo, alignRight: true })

    playerElement.append(<div className="text-muted text-md">{eloElement}</div>)
  })
}
