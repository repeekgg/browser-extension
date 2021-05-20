import select from 'select-dom'
import {
  getMatchState,
  getRoomId,
  getTeamElements
} from '../helpers/match-room'
import { getQuickMatch, getMatch } from '../helpers/faceit-api'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import createMapStatsElement from '../components/map-stats'
import { getTeamStatsMemoized } from '../helpers/stats'

const FEATURE_ATTRIBUTE = 'maps-stats'

export default async parent => {
  const matchState = getMatchState(parent)

  if (
    !['VOTING', 'CONFIGURING', 'READY', 'ONGOING', 'FINISHED'].includes(
      matchState
    )
  ) {
    return
  }

  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const match = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  const matchDetailsElement = select(`div.match-vs__details`, parent)
  if (!matchDetailsElement) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, matchDetailsElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, matchDetailsElement)

  const mapsListElements = select.all(
    'div[class*=sc-UWGlQ]',
    matchDetailsElement
  )

  if (mapsListElements.length === 0) {
    return
  }
  const mapsOnMatchObject = mapsListElements.map(map => ({
    element: map,
    label: select('div[class*=sc-cTqvXd]', map).innerText
  }))
  const mapsNameOnMatch = mapsOnMatchObject.map(map => ({
    ...map,
    mapName: `de_${map.label.toLowerCase()}`
  }))

  const mapsWithTeamStats = await getTeamStatsMemoized(
    match,
    teamElements,
    isTeamV1Element,
    mapsNameOnMatch
  )
  console.log('teamStats', mapsWithTeamStats)

  console.log('mapsNameOnMatch', mapsNameOnMatch)
  mapsWithTeamStats.forEach(({ element, stats }) => {
    const statsElement = createMapStatsElement(stats)

    const mapDetailsElement = select('.sc-kHPmWf', element)
    mapDetailsElement.after(statsElement)
  })
  console.log('END CREATING ELEMENTS', mapsNameOnMatch)
}
