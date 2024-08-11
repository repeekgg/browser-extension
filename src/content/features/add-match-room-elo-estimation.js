import React from 'dom-chef'
import select from 'select-dom'
import storage from '../../shared/storage'
import {
  hasFeatureAttribute,
  isFaceitNext,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { predictRatingChange } from '../helpers/elo'
import { getMatch, getSelf } from '../helpers/faceit-api'
import { isSupportedGame } from '../helpers/games'
import { getRoomId } from '../helpers/match-room'

const FEATURE_ATTRIBUTE = 'match-room-elo-estimation'

export default async () => {
  const matchFactionsHeaderElement = select(
    isFaceitNext()
      ? 'div[class*="FactionsDetails__Container"]'
      : 'div[id*="MATCHROOM-OVERVIEW"] > div > div > div:nth-child(2)',
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

  if (!match || !isSupportedGame(match.game) || match.state === 'FINISHED') {
    return
  }

  const matchPlayers = [
    ...match.teams.faction1.roster,
    ...match.teams.faction2.roster,
  ]

  const { matchRoomFocusMode } = await storage.getAll()
  const self = await getSelf()

  if (
    matchRoomFocusMode &&
    matchPlayers.some((player) => player.id === self.id)
  ) {
    return
  }

  const factions = ['faction1', 'faction2']

  const [faction1AverageElo, faction2AverageElo] = factions.map((faction) => {
    const factionPlayers = match.teams[faction].roster

    const factionTotalElo = factionPlayers.reduce((factionTotalElo, player) => {
      if (!player.elo) {
        return factionTotalElo
      }

      return factionTotalElo + player.elo
    }, 0)

    return Math.floor(factionTotalElo / factionPlayers.length)
  })

  const [faction1PredictedEloChange, faction2PredictedEloChange] = factions.map(
    (faction) => predictRatingChange(match.teams[faction].stats.winProbability),
  )

  const faction1AverageEloDiff = faction1AverageElo - faction2AverageElo
  const faction2AverageEloDiff = faction2AverageElo - faction1AverageElo

  const addFactionEloEstimations = () => {
    const faction1HeaderElement = isFaceitNext()
      ? select.all('div[class*="FactionsDetails__FactionInfo"')[0]
      : select(
          'div:nth-child(1) > a > div:nth-child(1)',
          matchFactionsHeaderElement,
        ) ||
        select(
          'div:nth-child(1) > div:nth-child(1)',
          matchFactionsHeaderElement,
        )

    const faction2HeaderElement = isFaceitNext()
      ? select.all('div[class*="FactionsDetails__FactionInfo"')[1]
      : select(
          'div:nth-child(3) > a > div:nth-child(1)',
          matchFactionsHeaderElement,
        ) ||
        select(
          'div:nth-child(3) > div:nth-child(1)',
          matchFactionsHeaderElement,
        )

    const factionEloEstimations = [
      [
        faction1HeaderElement,
        faction1AverageElo,
        faction1AverageEloDiff,
        faction1PredictedEloChange,
      ],
      [
        faction2HeaderElement,
        faction2AverageElo,
        faction2AverageEloDiff,
        faction2PredictedEloChange,
      ],
    ]

    factionEloEstimations.forEach(
      (
        [
          factionHeaderElement,
          factionAverageElo,
          factionAverageEloDiff,
          factionPredictedEloChange,
        ],
        index,
      ) => {
        const factionFeatureAttribute = `${FEATURE_ATTRIBUTE}-faction${
          index + 1
        }`

        if (
          !factionHeaderElement ||
          hasFeatureAttribute(factionFeatureAttribute, factionHeaderElement)
        ) {
          return
        }

        setFeatureAttribute(factionFeatureAttribute, factionHeaderElement)

        factionHeaderElement.appendChild(
          <div
            style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 2,
              lineHeight: '14px',
            }}
          >
            Avg. Elo: {factionAverageElo} / Diff:{' '}
            {`${factionAverageEloDiff > 0 ? '+' : ''}${factionAverageEloDiff}`}
            <br />
            <span>Est. Gain: +{factionPredictedEloChange.gain}</span> /{' '}
            <span>Est. Loss: {factionPredictedEloChange.loss}</span>
          </div>,
        )
      },
    )
  }

  addFactionEloEstimations()

  const observer = new MutationObserver(() => {
    try {
      addFactionEloEstimations()
    } catch (error) {
      observer.disconnect()
    }
  })

  observer.observe(matchFactionsHeaderElement, {
    childList: true,
    subtree: true,
  })
}
