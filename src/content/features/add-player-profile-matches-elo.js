/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { getPlayer, getPlayerMatches, getSelf } from '../helpers/faceit-api'
import { getEloChangesByMatches } from '../helpers/elo'
import {
  getPlayerProfileNickname,
  getPlayerProfileStatsGame
} from '../helpers/player-profile'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { getIsFreeMember } from '../helpers/membership'

const FEATURE_ATTRIBUTE = 'matches-elo'

export default async parentElement => {
  const playerProfileParasiteElement = select(
    'parasite-player-profile-content',
    parentElement
  )

  if (!playerProfileParasiteElement) {
    return
  }

  const playerProfileElement = select(
    '#__next > div',
    playerProfileParasiteElement.shadowRoot
  )

  const matchElements = select.all('table > tbody > tr', playerProfileElement)

  matchElements.shift()

  if (
    !playerProfileElement ||
    matchElements.length === 0 ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, playerProfileElement)
  ) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, playerProfileElement)

  const nickname = getPlayerProfileNickname()
  const game = getPlayerProfileStatsGame()
  const player = await getPlayer(nickname)
  const self = await getSelf()
  const selfIsFreeMember = getIsFreeMember(self)

  const matches = await getPlayerMatches(player.id, game, 21)
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

    if (selfIsFreeMember) {
      return
    }

    const newEloElement = (
      <div
        style={{
          color: '#fff',
          fontWeight: 'normal',
          textTransform: 'none'
        }}
      >
        New Elo: {newElo}
      </div>
    )

    resultElement.append(newEloElement)
  })
}
