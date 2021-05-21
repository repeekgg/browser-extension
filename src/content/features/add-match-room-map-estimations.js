/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import storage from '../../shared/storage'
import {
  getRoomId,
  getTeamElements,
  mapMatchFactionRostersMemoized,
  mapMatchFactionWinRates
} from '../helpers/match-room'
import {
  getMatch,
  getPlayerMatches,
  getQuickMatch
} from '../helpers/faceit-api'
import maps from '../helpers/maps'

const FEATURE_ATTRIBUTE = 'map-estimation'

export default async parentElement => {
  const { matchRoomFocusMode } = await storage.getAll()

  if (matchRoomFocusMode) {
    return
  }

  const mapVetoElements = select.all(
    `democracy[match-id="vm.currentMatch.match.id"]>div>div:nth-child(2)>div`,
    parentElement
  )

  if (!mapVetoElements) {
    return
  }

  const { isTeamV1Element } = getTeamElements(parentElement)

  const roomId = getRoomId()
  const match = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  if (!match) {
    return
  }

  const factionRosters = mapMatchFactionRostersMemoized(match)

  const playerMatches = (
    await Promise.all(
      [...factionRosters.faction1, ...factionRosters.faction2].map(
        async player => {
          const userId = isTeamV1Element ? player.guid : player.id

          return getPlayerMatches(userId, match.game)
        }
      )
    )
  ).flat()

  mapVetoElements.forEach(async mapElement => {
    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, mapElement)) {
      return
    }

    setFeatureAttribute(FEATURE_ATTRIBUTE, mapElement)

    mapElement.style.paddingRight = '0px'
    mapElement.firstChild.style.paddingRight = '8px'

    const mapName = mapElement.firstChild.textContent.trim()
    const orginalName = Object.keys(maps.csgo).find(
      key => maps.csgo[key] === mapName
    )

    if (!orginalName) {
      return
    }

    const rosters = mapMatchFactionWinRates(
      factionRosters,
      playerMatches,
      orginalName
    )

    mapElement.append(
      <div
        style={{
          display: 'flex',
          fontSize: '12px',
          lineHeight: '12px',
          color: '#777',
          borderTop: '1px solid rgb(51, 51, 51)',
          width: '100%'
        }}
      >
        <div
          style={{ padding: '5px 9px', flex: '1 1 45%', cursor: 'help' }}
          title="Play Rate (PR) / Win Rate (WR) in last 20 matches"
        >
          {rosters[0].playRate}% PR / {rosters[0].winRate}% WR
        </div>
        <div
          style={{
            padding: '5px 9px',
            flex: '1 1 10%',
            borderRight: '1px solid rgb(51, 51, 51)',
            borderLeft: '1px solid rgb(51, 51, 51)',
            textAlign: 'center'
          }}
        >
          VS
        </div>
        <div
          style={{
            padding: '5px 9px',
            flex: '1 1 45%',
            textAlign: 'right',
            cursor: 'help'
          }}
          title="Play Rate (PR) / Win Rate (WR) in last 20 matches"
        >
          {rosters[1].playRate}% PR / {rosters[1].winRate}% WR
        </div>
      </div>
    )
  })
}
