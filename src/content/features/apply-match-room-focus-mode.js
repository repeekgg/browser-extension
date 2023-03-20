import React from 'dom-chef'
import select from 'select-dom'
import { getRoomId } from '../helpers/match-room'
import { getSelf, getMatch } from '../helpers/faceit-api'
import {
  setStyle,
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'

const FEATURE_ATTRIBUTE = 'focus-mode'

export default async parent => {
  const parasiteRootElement = select('#parasite-container', parent).shadowRoot

  const roomId = getRoomId()
  const { status, teams } = await getMatch(roomId)

  if (!['VOTING', 'CONFIGURING', 'READY', 'ONGOING'].includes(status)) {
    return
  }

  const self = await getSelf()
  const isSelfInMatch = [
    ...teams.faction1.roster,
    ...teams.faction2.roster
  ].some(player => player.id === self.id)

  if (!isSelfInMatch) {
    return
  }

  const matchRoomOverviewElement = select(
    '#MATCHROOM-OVERVIEW',
    parasiteRootElement
  )

  if (matchRoomOverviewElement) {
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
      matchRoomOverviewElement.children[0]?.children[0]?.children[1]
        ?.children[0],
      matchRoomOverviewElement.children[0]?.children[0]?.children[1]
        ?.children[2]
    ]

    teamNameElements.forEach(teamNameElement => {
      if (
        teamNameElement &&
        !hasFeatureAttribute(FEATURE_ATTRIBUTE, teamNameElement)
      ) {
        setFeatureAttribute(FEATURE_ATTRIBUTE, teamNameElement)
        setStyle(teamNameElement, 'visibility: hidden')
      }
    })

    const teamElements = [
      select('[name="roster1"]', matchRoomOverviewElement),
      select('[name="roster2"]', matchRoomOverviewElement)
    ]

    teamElements.forEach(teamElement => {
      if (teamElement && !hasFeatureAttribute(FEATURE_ATTRIBUTE, teamElement)) {
        setFeatureAttribute(FEATURE_ATTRIBUTE, teamElement)
        setStyle(teamElement, 'visibility: hidden')
      }
    })

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
            color: 'rgba(255, 255, 255, 0.6)'
          }}
        >
          <div style={{ background: '#1f1f1f', borderRadius: 4, padding: 8 }}>
            Focus mode powered by FACEIT Enhancer
          </div>
        </div>
      )
    }
  }
}
