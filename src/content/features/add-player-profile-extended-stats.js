import React from 'dom-chef'
import createHrElement from '../components/hr'
import createKeyStatElement from '../components/key-stat'
import createSectionTitleElement from '../components/section-title'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getPlayer, getPlayerStats } from '../helpers/faceit-api'
import {
  getPlayerProfileNickname,
  getPlayerProfileStatsGame,
} from '../helpers/player-profile'

const FEATURE_ATTRIBUTE = 'extended-stats'

export default async (statsContentElement) => {
  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, statsContentElement)) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, statsContentElement)

  const mainStatisticsElement = statsContentElement.children[3]

  const nickname = getPlayerProfileNickname()
  const game = getPlayerProfileStatsGame()
  const { infractions = {}, ...player } = await getPlayer(nickname)

  const { afk = 0, leaver = 0 } = infractions

  const playerStats = await getPlayerStats(player.id, game)

  if (!playerStats) {
    return
  }

  const { averageKills, averageHeadshots, averageKDRatio, averageKRRatio } =
    playerStats

  const extendedStatsElement = (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 2 }}>
            {createSectionTitleElement({ title: 'Last 20 Matches Statistics' })}
            <div style={{ display: 'flex', gap: 16 }}>
              {createKeyStatElement({
                key: 'Average Kills',
                stat: averageKills,
              })}
              {createKeyStatElement({
                key: 'Average Headshots %',
                stat: averageHeadshots,
              })}
              {createKeyStatElement({
                key: 'Average K/D',
                stat: averageKDRatio,
              })}
              {createKeyStatElement({
                key: 'Average K/R',
                stat: averageKRRatio,
              })}
            </div>
            <div />
          </div>
          <div style={{ flex: 1 }}>
            {createSectionTitleElement({ title: 'Other Statistics' })}
            <div style={{ display: 'flex', gap: 16 }}>
              {createKeyStatElement({
                key: 'AFK Times',
                stat: afk,
              })}
              {createKeyStatElement({
                key: 'Leave Times',
                stat: leaver,
              })}
            </div>
          </div>
        </div>
      </div>
      {createHrElement()}
    </div>
  )

  mainStatisticsElement.insertAdjacentElement('afterend', extendedStatsElement)
}
