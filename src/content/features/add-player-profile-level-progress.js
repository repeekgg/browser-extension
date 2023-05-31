import React from 'dom-chef'
import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { getPlayer } from '../helpers/faceit-api'
import { LEVELS } from '../helpers/elo'
import {
  getPlayerProfileNickname,
  getPlayerProfileStatsGame
} from '../helpers/player-profile'
import createSkillLevelIconElement from '../components/skill-level'
import createHrElement from '../components/hr'
import createKeyStatElement from '../components/key-stat'
import createSectionTitleElement from '../components/section-title'

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
  borderRight = true
}) => {
  const style = { opacity: currentLevel === level ? 1 : 0.5 }
  return (
    <div
      className="text-light"
      style={{
        width: `${width}%`,
        'border-right': borderRight && '1px solid #4b4e4e',
        'text-align': 'center',
        padding: '10px 0'
      }}
    >
      {createSkillLevelIconElement({ level, style })}
      {createEloRangeElement({ from: eloFrom, to: eloTo, style })}
    </div>
  )
}

export default async () => {
  const parasitePlayerProfileElement = select(
    'parasite-player-profile-content > div'
  )

  if (
    parasitePlayerProfileElement?.children.length !== 13 ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, parasitePlayerProfileElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, parasitePlayerProfileElement)

  const mainStatsElement = parasitePlayerProfileElement.children[1]

  const nickname = getPlayerProfileNickname()
  const player = await getPlayer(nickname)

  if (!player) {
    return
  }

  const { games } = player
  const game = getPlayerProfileStatsGame()
  const { skillLevel: currentLevel, faceitElo = 1000 } = games[game]
  const progressWidth = (faceitElo / 2000) * 100

  const levelProgressElement = (
    <>
      <div style={{ marginBottom: 32 }}>
        {createSectionTitleElement({ title: 'Level Progress' })}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          {createKeyStatElement({
            key: 'Level',
            stat: createSkillLevelIconElement({ level: currentLevel })
          })}
          {createKeyStatElement({ key: 'Elo', stat: faceitElo })}
          {currentLevel === 10
            ? createKeyStatElement({ key: `Maximum level reached`, stat: '🔥' })
            : createKeyStatElement({
                key: `Points needed to reach level ${currentLevel + 1}`,
                stat: LEVELS[currentLevel + 1][0] - faceitElo
              })}
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '92%' }}>
            <div style={{ display: 'flex' }}>
              {createSkillLevelElement({
                level: 1,
                currentLevel,
                eloFrom: 1,
                eloTo: 800,
                width: 40
              })}
              {createSkillLevelElement({
                level: 2,
                currentLevel,
                eloFrom: 801,
                eloTo: 950
              })}
              {createSkillLevelElement({
                level: 3,
                currentLevel,
                eloFrom: 951,
                eloTo: 1100
              })}
              {createSkillLevelElement({
                level: 4,
                currentLevel,
                eloFrom: 1101,
                eloTo: 1250
              })}
              {createSkillLevelElement({
                level: 5,
                currentLevel,
                eloFrom: 1251,
                eloTo: 1400
              })}
              {createSkillLevelElement({
                level: 6,
                currentLevel,
                eloFrom: 1401,
                eloTo: 1550
              })}
              {createSkillLevelElement({
                level: 7,
                currentLevel,
                eloFrom: 1551,
                eloTo: 1700
              })}
              {createSkillLevelElement({
                level: 8,
                currentLevel,
                eloFrom: 1701,
                eloTo: 1850
              })}
              {createSkillLevelElement({
                level: 9,
                currentLevel,
                eloFrom: 1851,
                eloTo: 2000
              })}
            </div>
            <div style={{ height: 4, background: '#323737' }}>
              <div
                style={{
                  width: progressWidth > 100 ? '100%' : `${progressWidth}%`,
                  height: '100%',
                  background: '#f50'
                }}
              />
            </div>
          </div>
          <div style={{ width: '8%' }}>
            {createSkillLevelElement({
              level: 10,
              currentLevel,
              eloFrom: 2001,
              eloTo: '∞',
              width: 100,
              borderRight: false
            })}
            <div
              style={{
                width: '100%',
                height: 4,
                background: progressWidth > 100 ? '#f50' : '#323737'
              }}
            />
          </div>
        </div>
      </div>
      {createHrElement()}
    </>
  )

  parasitePlayerProfileElement.insertBefore(
    levelProgressElement,
    mainStatsElement
  )
}
