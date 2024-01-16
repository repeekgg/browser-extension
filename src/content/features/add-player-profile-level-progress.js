import React from 'dom-chef'
import createHrElement from '../components/hr'
import createKeyStatElement from '../components/key-stat'
import createSectionTitleElement from '../components/section-title'
import createSkillLevelIconElement from '../components/skill-level'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { SKILL_LEVELS_BY_GAME } from '../helpers/elo'
import { getPlayer } from '../helpers/faceit-api'
import {
  getPlayerProfileNickname,
  getPlayerProfileStatsGame,
} from '../helpers/player-profile'

const FEATURE_ATTRIBUTE = 'level-progress'

const createEloRangeElement = ({ from, to, style }) => (
  <div style={{ 'margin-top': 2, fontSize: 12, ...style }}>
    {from} – {to}
  </div>
)

const createSkillLevelElement = ({
  level,
  currentLevel,
  eloFrom,
  eloTo,
  width = 7.5,
  borderRight = true,
}) => {
  const style = { opacity: currentLevel === level ? 1 : 0.5 }
  return (
    <div
      className="text-light"
      style={{
        width: `${width}%`,
        'border-right': borderRight && '1px solid #4b4e4e',
        'text-align': 'center',
        padding: '10px 0',
      }}
    >
      {createSkillLevelIconElement({ level, style })}
      {createEloRangeElement({ from: eloFrom, to: eloTo, style })}
    </div>
  )
}

export default async (statsContentElement) => {
  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, statsContentElement)) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, statsContentElement)

  const gameSelectorElement = statsContentElement.children[0]

  const nickname = getPlayerProfileNickname()
  const player = await getPlayer(nickname)

  if (!player) {
    return
  }

  const { games } = player
  const game = getPlayerProfileStatsGame()
  const skillLevels = SKILL_LEVELS_BY_GAME[game]

  if (!skillLevels) {
    return
  }

  const { skillLevel: currentLevel, faceitElo = 1000 } = games[game]
  const progressWidth = (faceitElo / 2000) * 100

  const levelProgressElement = (
    <div>
      <div style={{ marginBottom: 32 }}>
        {createSectionTitleElement({ title: 'Level Progress' })}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          {createKeyStatElement({
            key: 'Level',
            stat: createSkillLevelIconElement({ level: currentLevel }),
          })}
          {createKeyStatElement({ key: 'Elo', stat: faceitElo })}
          {currentLevel === 10
            ? createKeyStatElement({ key: `Maximum level reached`, stat: '🔥' })
            : createKeyStatElement({
                key: `Points needed to reach level ${currentLevel + 1}`,
                stat: skillLevels[currentLevel + 1][0] - faceitElo,
              })}
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '92%' }}>
            <div style={{ display: 'flex' }}>
              {createSkillLevelElement({
                level: 1,
                currentLevel,
                eloFrom: skillLevels[1][0],
                eloTo: skillLevels[1][1],
                width: 25,
              })}
              {createSkillLevelElement({
                level: 2,
                currentLevel,
                eloFrom: skillLevels[2][0],
                eloTo: skillLevels[2][1],
                width: 12.5,
              })}
              {createSkillLevelElement({
                level: 3,
                currentLevel,
                eloFrom: skillLevels[3][0],
                eloTo: skillLevels[3][1],
              })}
              {createSkillLevelElement({
                level: 4,
                currentLevel,
                eloFrom: skillLevels[4][0],
                eloTo: skillLevels[4][1],
              })}
              {createSkillLevelElement({
                level: 5,
                currentLevel,
                eloFrom: skillLevels[5][0],
                eloTo: skillLevels[5][1],
              })}
              {createSkillLevelElement({
                level: 6,
                currentLevel,
                eloFrom: skillLevels[6][0],
                eloTo: skillLevels[6][1],
              })}
              {createSkillLevelElement({
                level: 7,
                currentLevel,
                eloFrom: skillLevels[7][0],
                eloTo: skillLevels[7][1],
                width: 9,
              })}
              {createSkillLevelElement({
                level: 8,
                currentLevel,
                eloFrom: skillLevels[8][0],
                eloTo: skillLevels[8][1],
                width: 11,
              })}
              {createSkillLevelElement({
                level: 9,
                currentLevel,
                eloFrom: skillLevels[9][0],
                eloTo: skillLevels[9][1],
                width: 12.5,
              })}
            </div>
            <div style={{ height: 4, background: '#323737' }}>
              <div
                style={{
                  width: progressWidth > 100 ? '100%' : `${progressWidth}%`,
                  height: '100%',
                  background: '#f50',
                }}
              />
            </div>
          </div>
          <div style={{ width: '8%' }}>
            {createSkillLevelElement({
              level: 10,
              currentLevel,
              eloFrom: skillLevels[10][0],
              eloTo: '∞',
              width: 100,
              borderRight: false,
            })}
            <div
              style={{
                width: '100%',
                height: 4,
                background: progressWidth > 100 ? '#f50' : '#323737',
              }}
            />
          </div>
        </div>
      </div>
      {createHrElement()}
    </div>
  )

  gameSelectorElement.insertAdjacentElement('afterend', levelProgressElement)
}
