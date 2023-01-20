import select from 'select-dom'
import { getRoomId } from '../helpers/match-room'
import { getSelf, getPlayerMatches } from '../helpers/faceit-api'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { getEloChangesByMatches } from '../helpers/elo'
import { getIsFreeMember } from '../helpers/membership'

const FEATURE_ATTRIBUTE = 'matches-elo'

export default async () => {
  const matchHistoryElement = select(
    'activity-tracker #scrollable .infinite-scroll-component'
  )

  if (
    !matchHistoryElement ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)
  ) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)

  const matchElements = select.all('a', matchHistoryElement)

  if (matchElements.length === 0) {
    return
  }

  const self = await getSelf()
  const game = self.flag
  const isFreeMember = getIsFreeMember(self)

  const matches = await getPlayerMatches(self.id, game)
  const eloChangesByMatches = await getEloChangesByMatches(matches, game)

  if (!eloChangesByMatches) {
    return
  }

  matchElements.forEach(matchElement => {
    const matchId = getRoomId(matchElement.getAttribute('href'))

    const resultElement = select(
      'div > div > div:nth-child(2) > span',
      matchElement
    )

    const eloChange = eloChangesByMatches[matchId]

    if (!eloChange) {
      return
    }

    const { eloDiff, newElo } = eloChange

    resultElement.textContent += ` (${eloDiff >= 0 ? '+' : ''}${eloDiff}${
      isFreeMember ? '' : ` / ${newElo}`
    } Elo)`
  })
}
