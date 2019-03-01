/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { getPlayer, getPlayerStats } from '../libs/faceit'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle
} from '../libs/dom-element'
import { isModalOpen } from '../libs/utils'
import createPlayerStatsElement from '../components/player-stats'

const FEATURE_ATTRIBUTE = 'tournament-checkin-player-stats'

export default async parentElement => {
  if (!isModalOpen()) {
    return
  }

  const playerElements = select.all('.roster .roster__member' , parentElement)

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

    const { guid } = player
    const stats = await getPlayerStats(guid, game)

    if (!stats) {
      return
    }

    const statsElement = createPlayerStatsElement(stats)

    playerElement.after(<div style={{ width: '100%' }}>{statsElement}</div>)
  })

  const userList = select('.modal-dialog .roster')
  setStyle(userList, 'margin-bottom: 25px')
}
