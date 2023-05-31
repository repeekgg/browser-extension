import React from 'dom-chef'
import select from 'select-dom'
import { getRoomId } from '../helpers/match-room'
import { getSelf, getPlayerMatches } from '../helpers/faceit-api'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { getEloChangesByMatches } from '../helpers/elo'

const FEATURE_ATTRIBUTE = 'matches-elo'

export default async () => {
  const matchHistoryElement = select(
    'parasite-activity-tracker .infinite-scroll-component'
  )

  if (
    !matchHistoryElement ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)
  ) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)

  const matchLinkElements = select.all('a', matchHistoryElement)

  if (matchLinkElements.length === 0) {
    return
  }

  const self = await getSelf()
  const game = self.flag

  const matches = await getPlayerMatches(self.id, game, 31)
  const eloChangesByMatches = await getEloChangesByMatches(matches, game)

  if (!eloChangesByMatches) {
    return
  }

  matchLinkElements.forEach(matchLinkElement => {
    const matchId = getRoomId(matchLinkElement.getAttribute('href'))

    const resultElement = select(
      'div > div > div:nth-child(2) > span',
      matchLinkElement
    )

    const eloChange = eloChangesByMatches[matchId]

    if (!eloChange) {
      return
    }

    const { eloDiff, newElo } = eloChange

    resultElement.textContent += ` (${eloDiff >= 0 ? '+' : ''}${eloDiff})`

    const matchElement = resultElement.parentElement.parentElement
    const matchTypeElement = matchElement.lastChild

    matchElement.insertBefore(
      <div
        style={{
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          color: '#A0A0A0'
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 12"
          style={{ height: 8 }}
        >
          <path
            fill="currentColor"
            d="M12 3c0 .463-.105.902-.292 1.293l1.998 2A2.97 2.97 0 0 1 15 6a2.99 2.99 0 0 1 1.454.375l1.921-1.921a3 3 0 1 1 1.5 1.328l-2.093 2.093a3 3 0 1 1-5.49-.168l-1.999-2a2.992 2.992 0 0 1-2.418.074L5.782 7.876a3 3 0 1 1-1.328-1.5l1.921-1.921A3 3 0 1 1 12 3z"
          />
        </svg>
        <span>{newElo}</span>
      </div>,
      matchTypeElement
    )
  })
}
