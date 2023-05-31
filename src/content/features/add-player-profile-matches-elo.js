import React from 'dom-chef'
import select from 'select-dom'
import { getPlayer, getPlayerMatches } from '../helpers/faceit-api'
import { getEloChangesByMatches } from '../helpers/elo'
import {
  getPlayerProfileNickname,
  getPlayerProfileStatsGame
} from '../helpers/player-profile'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'

const FEATURE_ATTRIBUTE = 'matches-elo'

export default async () => {
  const parasitePlayerProfileElement = select(
    'parasite-player-profile-content > div'
  )

  const matchElements = select.all(
    'table > tbody > tr',
    parasitePlayerProfileElement
  )

  // Remove table head row
  matchElements.shift()

  if (
    matchElements.length === 0 ||
    !parasitePlayerProfileElement ||
    parasitePlayerProfileElement.children.length < 13 ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, parasitePlayerProfileElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, parasitePlayerProfileElement)

  const nickname = getPlayerProfileNickname()
  const game = getPlayerProfileStatsGame()
  const player = await getPlayer(nickname)

  const matches = await getPlayerMatches(player.id, game, 31)
  const eloChangesByMatches = await getEloChangesByMatches(matches, game)

  if (!eloChangesByMatches) {
    return
  }

  matchElements.forEach((matchElement, i) => {
    const scoreElement = select('td:nth-child(4) span', matchElement)
    const mapElement = select('td:nth-child(5) span', matchElement)

    const match = matches[i]

    if (
      !match ||
      match.i18 !== scoreElement.textContent.trim() ||
      match.i1 !== mapElement.textContent.trim()
    ) {
      return
    }

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
          alignItems: 'center'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          color="secondary"
          viewBox="0 0 24 12"
          style={{ height: 8 }}
        >
          <path
            fill="#fff"
            d="M12 3c0 .463-.105.902-.292 1.293l1.998 2A2.97 2.97 0 0 1 15 6a2.99 2.99 0 0 1 1.454.375l1.921-1.921a3 3 0 1 1 1.5 1.328l-2.093 2.093a3 3 0 1 1-5.49-.168l-1.999-2a2.992 2.992 0 0 1-2.418.074L5.782 7.876a3 3 0 1 1-1.328-1.5l1.921-1.921A3 3 0 1 1 12 3z"
          />
        </svg>
        <span
          style={{ color: '#fff', fontWeight: 'normal', textTransform: 'none' }}
        >
          {newElo}
        </span>
      </div>
    )

    resultElement.append(newEloElement)
  })
}
