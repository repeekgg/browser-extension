/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { getPlayer, getPlayerStats } from '../helpers/faceit-api'
import {
  getPlayerProfileNickname,
  getPlayerProfileStatsGame
} from '../helpers/player-profile'
import createSectionTitleElement from '../components/section-title'
import createKeyStatElement from '../components/key-stat'
import createHrElement from '../components/hr'

const FEATURE_ATTRIBUTE = 'extended-stats'

export default async parentElement => {
  const profileElement = select('section.profile > div.profile', parentElement)

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, profileElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, profileElement)

  const nickname = getPlayerProfileNickname()
  const game = getPlayerProfileStatsGame()
  const { guid, infractions = {} } = await getPlayer(nickname)

  const { afk = 0, leaver = 0 } = infractions

  const playerStats = await getPlayerStats(guid, game)

  if (!playerStats) {
    return
  }

  const {
    averageKills,
    averageHeadshots,
    averageKDRatio,
    averageKRRatio
  } = playerStats

  const statsElement = (
    <section>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 2, 'margin-right': 15 }}>
          {createSectionTitleElement({ title: 'Last 20 Matches Statistics' })}
          <div className="row flex flex-stretch">
            <div className="col-lg-3 flex-column-stretch">
              {createKeyStatElement({
                key: 'Average Kills',
                stat: averageKills
              })}
            </div>
            <div className="col-lg-3 flex-column-stretch">
              {createKeyStatElement({
                key: 'Average Headshots %',
                stat: averageHeadshots
              })}
            </div>
            <div className="col-lg-3 flex-column-stretch">
              {createKeyStatElement({
                key: 'Average K/D',
                stat: averageKDRatio
              })}
            </div>
            <div className="col-lg-3 flex-column-stretch">
              {createKeyStatElement({
                key: 'Average K/R',
                stat: averageKRRatio
              })}
            </div>
          </div>
          <div />
        </div>
        <div style={{ flex: 1, 'margin-left': 15 }}>
          {createSectionTitleElement({ title: 'Other Statistics' })}
          <div className="row flex flex-stretch">
            <div className="col-lg-6 flex-column-stretch">
              {createKeyStatElement({
                key: 'AFK Times',
                stat: afk
              })}
            </div>
            <div className="col-lg-6 flex-column-stretch">
              {createKeyStatElement({
                key: 'Leave Times',
                stat: leaver
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  const mainStatisticsElements = select(
    'h2[translate-once="MAIN-STATISTICS"]',
    parentElement
  ).parentElement

  profileElement.insertBefore(statsElement, mainStatisticsElements.nextSibling)

  const HrElement = createHrElement()

  profileElement.insertBefore(HrElement, statsElement)
}
