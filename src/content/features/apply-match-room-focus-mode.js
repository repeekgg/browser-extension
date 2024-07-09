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
  const matchRoomOverviewElement = select('div[id*="MATCHROOM-OVERVIEW"]')

  if (!matchRoomOverviewElement) {
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

  const teamBalanceElement =
    matchRoomOverviewElement.children[0].children[0].children[3]

  if (
    teamBalanceElement &&
    !hasFeatureAttribute(FEATURE_ATTRIBUTE, teamBalanceElement)
  ) {
    setFeatureAttribute(FEATURE_ATTRIBUTE, teamBalanceElement)
    setStyle(teamBalanceElement, 'display: none')
  }

  const teamNameElements = [
    matchRoomOverviewElement.children[0]?.children[0]?.children[1]?.children[0],
    matchRoomOverviewElement.children[0]?.children[0]?.children[1]?.children[2],
  ]

  for (const teamNameElement of teamNameElements) {
    if (
      teamNameElement &&
      !hasFeatureAttribute(FEATURE_ATTRIBUTE, teamNameElement)
    ) {
      setFeatureAttribute(FEATURE_ATTRIBUTE, teamNameElement)
      setStyle(teamNameElement, 'visibility: hidden')
    }
  }

  const teamElements = [
    select('[name="roster1"]', matchRoomOverviewElement),
    select('[name="roster2"]', matchRoomOverviewElement),
  ]

  for (const teamElement of teamElements) {
    if (teamElement && !hasFeatureAttribute(FEATURE_ATTRIBUTE, teamElement)) {
      setFeatureAttribute(FEATURE_ATTRIBUTE, teamElement)
      setStyle(teamElement, 'visibility: hidden')
    }
  }

  if (!hasFeatureAttribute(FEATURE_ATTRIBUTE, matchRoomOverviewElement)) {
    setFeatureAttribute(FEATURE_ATTRIBUTE, matchRoomOverviewElement)

    matchRoomOverviewElement.append(
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
