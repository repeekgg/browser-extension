/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  getSelf,
  getPlayerMatches,
  getQuickMatch,
  getMatch
} from '../libs/faceit'
import { mapMatchesByIdAndExtendElo } from '../libs/matches'
import { getRoomId } from '../libs/match-room'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { calculateRatingChange } from '../libs/elo'

const FEATURE_ATTRIBUTE = 'elo-points'

export default async () => {
  const matchHistoryElement = select(
    'div[ng-if="vm.matchStore.matchHistory.length"]'
  )

  if (!matchHistoryElement) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)

  const self = await getSelf()
  const isFreeMembership = self.membership.type === 'free'
  const matches = await getPlayerMatches(self.guid, self.flag, 21)

  const matchesById = mapMatchesByIdAndExtendElo(matches)

  const pastMatchElements = select.all(
    'navigation-match-v3-line[match="match"] > div',
    matchHistoryElement
  )

  pastMatchElements.forEach(async pastMatchElement => {
    const matchId = getRoomId(pastMatchElement.getAttribute('href'))

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

    const eloGained = eloDiff > 0

    const eloDiffElement = (
      <span
        className={eloGained ? 'text-success' : 'text-danger'}
        style={{ 'margin-left': 5 }}
      >
        {eloGained && '+'}
        {eloDiff}
      </span>
    )

    const opponentNameElement = select(
      'div.side-menu-line__text > div[class*="text-white"]',
      pastMatchElement
    )

    opponentNameElement.append(eloDiffElement)

    if (isFreeMembership || !newElo) {
      return
    }

    const newEloElement = (
      <div className="text-truncate block text-nav-gray">New Elo: {newElo}</div>
    )

    const { parentNode, nextSibling } = opponentNameElement
    parentNode.insertBefore(newEloElement, nextSibling)
  })
}
