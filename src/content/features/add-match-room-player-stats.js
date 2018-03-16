/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  getTeamElements,
  getRoomId,
  getFactionDetails,
  getTeamMemberElements,
  getNicknameElement
} from '../libs/match-room'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import {
  getQuickMatch,
  getMatch,
  getPlayer,
  getPlayerStats
} from '../libs/faceit'

const FEATURE_ATTRIBUTE = 'player-stats'

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const match = isTeamV1Element ? getQuickMatch(roomId) : getMatch(roomId)

  teamElements.forEach(async teamElement => {
    const { isFaction1 } = getFactionDetails(teamElement, isTeamV1Element)

    const memberElements = getTeamMemberElements(teamElement)

    memberElements.forEach(async memberElement => {
      if (hasFeatureAttribute(memberElement, FEATURE_ATTRIBUTE)) {
        return
      }
      setFeatureAttribute(memberElement, FEATURE_ATTRIBUTE)

      const nicknameElement = getNicknameElement(memberElement, isTeamV1Element)
      const nickname = nicknameElement.textContent

      const player = await getPlayer(nickname)

      if (!player) {
        return
      }

      const { guid } = player
      const { game } = await match
      const stats = await getPlayerStats(guid, game)

      if (!stats) {
        return
      }

      const {
        matches,
        winRate,
        averageKDRatio,
        averageKills,
        averageKRRatio,
        averageHeadshots
      } = stats

      const stat = (value, label) => (
        <div style={{ flex: 1, padding: '5px 9px' }}>
          {value}
          <div className="text-sm">{label}</div>
        </div>
      )

      const statsVerticalDivider = () => (
        <div style={{ width: 1, background: '#333' }} />
      )

      const statsElement = (
        <div
          className="text-muted"
          style={{
            display: 'flex',
            background: '#1b1b1f',
            'border-top': '1px solid #333',
            'text-align': !isFaction1 && 'right',
            'font-size': 12,
            'line-height': 12
          }}
        >
          {stat(`${matches} / ${winRate}%`, 'Matches / Wins')}
          {statsVerticalDivider()}
          {stat(`${averageKills} / ${averageHeadshots}%`, 'Avg. Kills / HS')}
          {statsVerticalDivider()}
          {stat(`${averageKDRatio} / ${averageKRRatio}`, 'Avg. K/D / K/R')}
        </div>
      )

      const memberDetailsElement = select(
        '.match-team-member__details',
        memberElement
      )
      memberDetailsElement.after(statsElement)
    })
  })
}
