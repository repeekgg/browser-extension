/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  getPlayer,
  getPlayerMatches,
  getQuickMatch,
  getMatch,
  getSelf
} from '../helpers/faceit-api'
import { mapMatchesWithElo } from '../helpers/matches'
import { getPlayerProfileNickname } from '../helpers/player-profile'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { calculateRatingChange } from '../helpers/elo'
import { getIsFreeMember } from '../helpers/membership'

const FEATURE_ATTRIBUTE = 'elo-points'
const MATCHES_PER_PAGE = 30 // FACEIT defined. Check the website to make sure this is up to date.
let nextPage = 0

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
  const self = await getSelf()
  const game = self.flag
  const selfHasFreeMembership = getIsFreeMember(self)

  const matchElements = select.all(
    'tbody > tr.match-history-stats__row',
    matchHistoryElement
  )

  if (matchElements.length === 0) {
    return
  }

  // Check if the first row has 'elo-points' applied.
  // If it doesn't, nextPage should be 0. This is required
  // because a user may navigate away and back to the stats page.
  if (!hasFeatureAttribute(FEATURE_ATTRIBUTE, matchElements[0])) {
    nextPage = 0
  }

  if (matchElements.length > nextPage * MATCHES_PER_PAGE) {
    const currentPage = nextPage
    nextPage += 1

    // Page generated more matches for us to fetch.
    const matches = await getPlayerMatches(
      player.guid,
      player.flag,
      MATCHES_PER_PAGE,
      currentPage
    )

    const matchesById = await mapMatchesWithElo(matches, game)
    if (!matchesById) {
      // No elo enabled matches found
      return
    }

    matches.forEach(async (match, index) => {
      const matchHistoryTableRow = currentPage * MATCHES_PER_PAGE + index
      const matchElement = matchElements[matchHistoryTableRow]
      const matchId = match.matchId
      if (hasFeatureAttribute(FEATURE_ATTRIBUTE, matchElement)) {
        return
      }
      setFeatureAttribute(FEATURE_ATTRIBUTE, matchElement)

      if (!matchesById[matchId]) {
        return
      }

      let { eloDiff, eloAfter, teamId, gameMode } = matchesById[matchId]
      if (!eloDiff) {
        let match

        if (gameMode.includes('5v5')) {
          match = await getQuickMatch(matchId)
          if (!match) {
            match = await getMatch(matchId)
          }
        } else {
          match = await getMatch(matchId)
        }

        const { faction1Id, faction1Elo, faction2Elo, winner } = match

        if (faction1Id && faction1Elo) {
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
      }

      const resultElement = select('td:nth-child(3) span', matchElement)

      if (eloDiff) {
        const gainedElo = eloDiff > 0
        resultElement.textContent = `${resultElement.textContent} (${
          gainedElo ? '+' : ''
        }${eloDiff})`
      }

      if (selfHasFreeMembership || !eloAfter) {
        return
      }

      const newEloElement = (
        <div style={{ color: '#fff', 'font-weight': 'normal' }}>
          New Elo: {eloAfter}
        </div>
      )
      resultElement.append(newEloElement)
    })
  }
}
