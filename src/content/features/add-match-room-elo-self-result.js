/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { getRoomId, getMatchState } from '../helpers/match-room'
import { getSelf, getPlayerMatches } from '../helpers/faceit-api'
import { mapMatchesWithElo } from '../helpers/matches'

const FEATURE_ATTRIBUTE = 'elo-self-result'

export default async parent => {
  const matchStateElement = select('matchroom-versus-status', parent)
  const matchState = getMatchState(parent)

  if (
    !matchState ||
    matchState !== 'FINISHED' ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, matchStateElement)
  ) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, matchStateElement)

  const self = await getSelf()
  const game = self.flag

  let matches = await getPlayerMatches(self.guid, game)
  matches = mapMatchesWithElo(matches, game)

  if (!matches) {
    return
  }

  const matchId = getRoomId()
  const match = matches[matchId]

  if (!match) {
    return
  }

  const { eloDiff } = match

  if (!eloDiff) {
    return
  }

  const matchResultElements = select.all('div[class*=sc-cFlMtL]')

  matchResultElements.forEach(matchResultElement => {
    const result = matchResultElement.textContent

    const eloElement = (
      <div className="text-muted" style={{ 'font-size': 14 }}>
        {result === 'W' ? '+' : '-'} {Math.abs(eloDiff)} Elo
      </div>
    )

    matchResultElement.parentElement.append(eloElement)
  })
}
