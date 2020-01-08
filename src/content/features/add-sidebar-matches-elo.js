/** @jsx h */
import select from 'select-dom'
import { getRoomId } from '../helpers/match-room'
import { getSelf, getPlayerMatches } from '../helpers/faceit-api'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { mapMatchesWithElo } from '../helpers/matches'
import { getIsFreeMember } from '../helpers/membership'

const FEATURE_ATTRIBUTE = 'elo-points'

export default async () => {
  const matchHistoryElements = select.all(
    'activity-tracker #scrollable .infinite-scroll-component a'
  )

  if (
    matchHistoryElements.length === 0 ||
    matchHistoryElements.some(matchHistoryElement =>
      hasFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)
    )
  ) {
    return
  }

  const self = await getSelf()
  const game = self.flag
  const isFreeMember = getIsFreeMember(self)

  let matches = await getPlayerMatches(self.guid, game)
  matches = mapMatchesWithElo(matches, game)

  if (!matches) {
    return
  }

  matchHistoryElements.forEach(matchHistoryElement => {
    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)) {
      return
    }
    setFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)

    const matchId = getRoomId(matchHistoryElement.getAttribute('href'))

    const resultElement = select(
      'div > div > div:nth-child(2) > span',
      matchHistoryElement
    )

    const match = matches[matchId]

    if (!match) {
      return
    }

    const { eloDiff, eloAfter } = match

    resultElement.textContent += ` (${eloDiff >= 0 ? '+' : ''}${eloDiff}${
      isFreeMember ? '' : ` / ${eloAfter}`
    } Elo)`
  })
}
