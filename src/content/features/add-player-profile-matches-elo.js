import React from 'dom-chef'
import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getEloChangesByMatches } from '../helpers/elo'
import { getPlayer, getPlayerMatches } from '../helpers/faceit-api'
import {
  getPlayerProfileNickname,
  getPlayerProfileStatsGame,
} from '../helpers/player-profile'

const FEATURE_ATTRIBUTE = 'matches-elo'

export default async (statsContentElement) => {
  const matchElements = select.all('table > tbody > tr', statsContentElement)

  // Remove table head row
  matchElements.shift()

  if (
    matchElements.length === 0 ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, statsContentElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, statsContentElement)

  const nickname = getPlayerProfileNickname()
  const game = getPlayerProfileStatsGame()
  const player = await getPlayer(nickname)

  const matches = await getPlayerMatches(player.id, game, 31)
  const eloChangesByMatches = await getEloChangesByMatches(matches, game)

  if (!eloChangesByMatches) {
    return
  }

  matchElements.forEach((matchElement, i) => {
    const match = matches[i]

    const eloChange = eloChangesByMatches[match.matchId]

    if (!eloChange) {
      return
    }

    const { eloDiff, newElo } = eloChange

    if (!eloDiff) {
      return
    }

    const resultElement = select('td:nth-child(3) span', matchElement)

    resultElement.textContent += ` (${eloDiff >= 0 ? '+' : ''}${eloDiff})`

    const newEloElement = (
      <div
        style={{
          display: 'flex',
          gap: 4,
          alignItems: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          color="secondary"
          viewBox="0 0 24 12"
          style={{ height: 8 }}
        >
          <title>Elo Icon</title>
          <path
            fill="#fff"
            d="M12 3c0 .463-.105.902-.292 1.293l1.998 2A2.97 2.97 0 0 1 15 6a2.99 2.99 0 0 1 1.454.375l1.921-1.921a3 3 0 1 1 1.5 1.328l-2.093 2.093a3 3 0 1 1-5.49-.168l-1.999-2a2.992 2.992 0 0 1-2.418.074L5.782 7.876a3 3 0 1 1-1.328-1.5l1.921-1.921A3 3 0 1 1 12 3z"
          />
        </svg>
        <span
          style={{
            color: '#fff',
            fontWeight: 'normal',
            textTransform: 'none',
          }}
        >
          {newElo}
        </span>
      </div>
    )

    resultElement.append(newEloElement)
  })
}
