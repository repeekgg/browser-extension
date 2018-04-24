/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  getPlayer,
  getPlayerMatches,
  getQuickMatch,
  getMatch
} from '../libs/faceit'
import { mapMatchesByIdAndExtendElo } from '../libs/matches'
import { getRoomId } from '../libs/match-room'
import { getPlayerProfileNickname } from '../libs/player-profile'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { calculateRatingChange } from '../libs/elo'

const FEATURE_ATTRIBUTE = 'elo-points'

export default async parentElement => {
  const matchHistoryElement = select(
    'div.js-match-history-stats',
    parentElement
  )

  if (!matchHistoryElement) {
    return
  }

  const nickname = await getPlayerProfileNickname()
  const player = await getPlayer(nickname)
  const isFreeMembership = player.membership.type === 'free'
  const matches = await getPlayerMatches(player.guid, player.flag, 21)

  const matchesById = mapMatchesByIdAndExtendElo(matches)

  const matchElements = select.all(
    'tbody > tr.match-history-stats__row',
    matchHistoryElement
  )

  if (matchElements.length === 0) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)

  matchElements.forEach(async matchElement => {
    const accordionElement = matchElement.nextElementSibling
    const goToMatchRoomElement = select(
      'a[ui-sref*="app.root.matchroom.main.overview"]',
      accordionElement
    )
    const resultElement = select('td:nth-child(3) span', matchElement)

    const matchId = getRoomId(goToMatchRoomElement.getAttribute('href'))

    if (!matchesById[matchId]) {
      return
    }

    let { eloDiff, newElo, teamId, gameMode } = matchesById[matchId]

    if (!eloDiff) {
      let match

      if (gameMode.includes('5v5')) {
        match = await getQuickMatch(matchId)
      } else {
        match = await getMatch(matchId)
      }

      const { faction1Id, faction1Elo, faction2Elo, winner } = match
      const isFaction1 = faction1Id === teamId
      const { winPoints, lossPoints } = calculateRatingChange(
        isFaction1 ? faction1Elo : faction2Elo,
        isFaction1 ? faction2Elo : faction1Elo
      )
      const hasWon =
        (winner === 'faction1' && isFaction1) ||
        (winner === 'faction2' && !isFaction1)
      eloDiff = hasWon ? winPoints : lossPoints
    }

    const gainedElo = eloDiff > 0

    resultElement.textContent = `${resultElement.textContent} (${
      gainedElo ? '+' : ''
    }${eloDiff})`

    if (isFreeMembership || !newElo) {
      return
    }

    const newEloElement = (
      <div style={{ color: '#fff', 'font-weight': 'normal' }}>
        New Elo: {newElo}
      </div>
    )

    resultElement.append(newEloElement)
  })
}
