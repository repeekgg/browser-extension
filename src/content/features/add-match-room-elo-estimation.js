import React from 'dom-chef'
import select from 'select-dom'
import { getMatch, getPlayerSummaries, getSelf } from '../helpers/faceit-api'
import { getRoomId } from '../helpers/match-room'
import storage from '../../shared/storage'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { predictRatingChange } from '../helpers/elo'

const FEATURE_ATTRIBUTE = 'match-room-elo-estimation'

export default async () => {
  const matchFactionsHeaderElement = select(
    '#MATCHROOM-OVERVIEW > div > div > div:nth-child(2)'
  )

  if (
    !matchFactionsHeaderElement ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, matchFactionsHeaderElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, matchFactionsHeaderElement)

  const roomId = getRoomId()
  const match = await getMatch(roomId)

  if (!match || match.game !== 'csgo' || match.state === 'FINISHED') {
    return
  }

  const matchPlayers = [
    ...match.teams.faction1.roster,
    ...match.teams.faction2.roster
  ]

  const { matchRoomFocusMode } = await storage.getAll()
  const self = await getSelf()

  if (
    matchRoomFocusMode &&
    matchPlayers.some(player => player.id === self.id)
  ) {
    return
  }

  const playerSummaries = await getPlayerSummaries(
    matchPlayers.map(player => player.id)
  )

  const factions = ['faction1', 'faction2']

  const [faction1AverageElo, faction2AverageElo] = factions.map(faction => {
    const factionPlayers = match.teams[faction].roster

    const factionTotalElo = factionPlayers.reduce(
      (factionTotalElo, player) =>
        factionTotalElo +
        playerSummaries[player.id].games.find(game => game.game === 'csgo').elo,
      0
    )

    return Math.floor(factionTotalElo / factionPlayers.length)
  })

  const [
    faction1PredictedEloChange,
    faction2PredictedEloChange
  ] = factions.map(faction =>
    predictRatingChange(match.teams[faction].stats.winProbability)
  )

  const faction1HeaderElement = matchFactionsHeaderElement.firstChild.firstChild
  const faction2HeaderElement = matchFactionsHeaderElement.lastChild.firstChild

  const faction1AverageEloDiff = faction1AverageElo - faction2AverageElo
  const faction2AverageEloDiff = faction2AverageElo - faction1AverageElo

  const factionEloEstimations = [
    [
      faction1HeaderElement,
      faction1AverageElo,
      faction1AverageEloDiff,
      faction1PredictedEloChange
    ],
    [
      faction2HeaderElement,
      faction2AverageElo,
      faction2AverageEloDiff,
      faction2PredictedEloChange
    ]
  ]

  factionEloEstimations.forEach(
    ([
      factionHeaderElement,
      factionAverageElo,
      factionAverageEloDiff,
      factionPredictedEloChange
    ]) => {
      factionHeaderElement.appendChild(
        <div
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}
        >
          Avg. Elo: {factionAverageElo} / Diff:{' '}
          {`${factionAverageEloDiff > 0 ? '+' : ''}${factionAverageEloDiff}`}
          <br />
          <span>Est. Gain: +{factionPredictedEloChange.gain}</span> /{' '}
          <span>Est. Loss: {factionPredictedEloChange.loss}</span>
        </div>
      )
    }
  )
}
