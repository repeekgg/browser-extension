/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getRoomId } from '../libs/match-room'
import { getSelf, getPlayerMatches } from '../libs/faceit'
import { mapMatchesWithElo } from '../libs/matches'

const FEATURE_ATTRIBUTE = 'elo-self-result'

export default async parent => {
  const matchStatusElement = select(
    'div[class*=VersusTeamStatus__Status]',
    parent
  )

  if (
    !matchStatusElement ||
    matchStatusElement.textContent !== 'FINISHED' ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, matchStatusElement)
  ) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, matchStatusElement)

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
