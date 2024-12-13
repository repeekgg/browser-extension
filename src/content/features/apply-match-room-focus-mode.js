import React from 'dom-chef'
import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle,
} from '../helpers/dom-element'
import { getMatch, getSelf } from '../helpers/faceit-api'
import { getRoomId } from '../helpers/match-room'

const FEATURE_ATTRIBUTE = 'focus-mode'

export default async () => {
  const matchRoomContainerElement = select('div[class*="MatchRoom__Container"]')

  if (!matchRoomContainerElement) {
    return
  }

  const roomId = getRoomId()
  const { status, teams } = await getMatch(roomId)

  if (status !== 'LIVE') {
    return
  }

  const self = await getSelf()
  const isSelfInMatch = [
    ...teams.faction1.roster,
    ...teams.faction2.roster,
  ].some((player) => player.id === self.id)

  if (!isSelfInMatch) {
    return
  }

  const matchBalanceElement = select(
    'div[class*="Header__MatchBalanceContainer"',
  )

  if (
    matchBalanceElement &&
    !hasFeatureAttribute(FEATURE_ATTRIBUTE, matchBalanceElement)
  ) {
    setFeatureAttribute(FEATURE_ATTRIBUTE, matchBalanceElement)
    setStyle(matchBalanceElement, 'display: none')
  }

  const factionInfoElements = select.all(
    'div[class*="FactionsDetails__FactionInfo"]',
  )

  if (factionInfoElements.length === 2) {
    for (const factionInfoElement of factionInfoElements) {
      if (
        factionInfoElement &&
        !hasFeatureAttribute(FEATURE_ATTRIBUTE, factionInfoElement)
      ) {
        setFeatureAttribute(FEATURE_ATTRIBUTE, factionInfoElement)
        setStyle(factionInfoElement, 'visibility: hidden')
      }
    }
  }

  const teamElements = [
    select('div[name="roster1"]', matchRoomContainerElement),
    select('div[name="roster2"]', matchRoomContainerElement),
  ]

  for (const teamElement of teamElements) {
    if (teamElement && !hasFeatureAttribute(FEATURE_ATTRIBUTE, teamElement)) {
      setFeatureAttribute(FEATURE_ATTRIBUTE, teamElement)
      setStyle(teamElement, 'visibility: hidden')
    }
  }

  if (!hasFeatureAttribute(FEATURE_ATTRIBUTE, matchRoomContainerElement)) {
    setFeatureAttribute(FEATURE_ATTRIBUTE, matchRoomContainerElement)

    matchRoomContainerElement.append(
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          fontSize: 12,
          color: 'rgba(255, 255, 255, 0.6)',
        }}
      >
        <div style={{ background: '#1f1f1f', borderRadius: 4, padding: 8 }}>
          Repeek Focus Mode Active
        </div>
      </div>,
    )
  }
}
