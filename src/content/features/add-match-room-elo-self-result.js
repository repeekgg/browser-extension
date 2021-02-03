/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { getRoomId, getMatchState } from '../helpers/match-room'
import { getSelf, getPlayerMatches } from '../helpers/faceit-api'
import { getEloChangesByMatches } from '../helpers/elo'

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

  const matches = await getPlayerMatches(self.guid, game)
  const roomId = getRoomId()

  if (!matches.some(match => match.matchId === roomId)) {
    return
  }

  const eloChangesByMatches = await getEloChangesByMatches(matches, game)

  if (!eloChangesByMatches) {
    return
  }

  const eloChange = eloChangesByMatches[roomId]

  if (!eloChange) {
    return
  }

  const { eloDiff } = eloChange

  const matchResultElements = select.all('div[class*=sc-cnIlNO]')

  matchResultElements.forEach(matchResultElement => {
    const result = matchResultElement.textContent

    const eloElement = (
      <div className="text-muted text-md">
        <b>
          {result === 'W' ? '+' : '-'}
          {Math.abs(eloDiff)} Elo
        </b>
      </div>
    )

    matchResultElement.parentElement.append(eloElement)
  })
}
