import React from 'dom-chef'
import select from 'select-dom'
import { IS_FACEIT_BETA } from '../../shared/faceit-beta'
import { randomNumber } from '../../shared/utils'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getEloChangesByMatches } from '../helpers/elo'
import { getPlayerMatches, getSelf } from '../helpers/faceit-api'
import { getRoomId } from '../helpers/match-room'
import { getIsFreeMember } from '../helpers/membership'

const FEATURE_ATTRIBUTE = 'matches-elo'

export default async () => {
  const matchHistoryElement = select(
    IS_FACEIT_BETA
      ? 'div[class*="ActivityList__Holder"] div[class*="ActivityList__SubHolder"]'
      : 'parasite-root-container .infinite-scroll-component',
  )

  if (
    !matchHistoryElement ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)
  ) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)

  const matchLinkElements = select.all('a[href*="/room/"]', matchHistoryElement)

  if (matchLinkElements.length === 0) {
    return
  }

  const self = await getSelf()
  const selfIsFreeMember = getIsFreeMember(self)
  const game = self.flag

  const matches = await getPlayerMatches(self.id, game, 31)
  const eloChangesByMatches = await getEloChangesByMatches(matches, game)

  if (!eloChangesByMatches) {
    return
  }

  for (const matchLinkElement of matchLinkElements) {
    const matchId = getRoomId(matchLinkElement.getAttribute('href'))

    const resultElement = select(
      'div > div > div:nth-child(2) > span',
      matchLinkElement,
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
          color: '#A0A0A0',
          cursor: selfIsFreeMember && 'help',
        }}
        title={
          selfIsFreeMember ? 'This feature requires FACEIT Premium' : undefined
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 12"
          style={{ height: 8 }}
        >
          <title>Elo Icon</title>
          <path
            fill="currentColor"
            d="M12 3c0 .463-.105.902-.292 1.293l1.998 2A2.97 2.97 0 0 1 15 6a2.99 2.99 0 0 1 1.454.375l1.921-1.921a3 3 0 1 1 1.5 1.328l-2.093 2.093a3 3 0 1 1-5.49-.168l-1.999-2a2.992 2.992 0 0 1-2.418.074L5.782 7.876a3 3 0 1 1-1.328-1.5l1.921-1.921A3 3 0 1 1 12 3z"
          />
        </svg>
        <span
          style={{
            filter: selfIsFreeMember && 'blur(4px)',
            opacity: selfIsFreeMember && 0.33,
          }}
        >
          {selfIsFreeMember ? randomNumber(1000, 3000) : newElo}
        </span>
      </div>,
      matchTypeElement,
    )
  }
}
