/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getRoomId, getMatchState } from '../libs/match-room'
import { getSelf, getPlayerMatches } from '../libs/faceit'
import { mapMatchesWithElo } from '../libs/matches'

const FEATURE_ATTRIBUTE = 'elo-self-result'

export default async parent => {
  const matchStateElement = select(
    'div[class*=VersusTeamStatus__Status]',
    parent
  )
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
  const matchResultElements = select.all('div[class*=MatchScore__Result]')

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
