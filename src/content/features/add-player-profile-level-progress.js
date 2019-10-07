/** @jsx h */
import { h } from 'dom-chef'
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
import createSkillLevelElement from '../components/skill-level'

const FEATURE_ATTRIBUTE = 'level-progress'

const keyStatElement = ({ key, stat }) => (
  <div className="key-stat well" style={{ height: '100%' }}>
    <div className="key-stat__value text-gray">{stat}</div>
    {key}
  </div>
)

const eloRangeElement = ({ from, to, style }) => (
  <div className="text-md" style={{ 'margin-top': 2, ...style }}>
    {from} – {to}
  </div>
)

const skillLevelElement = ({
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
      {createSkillLevelElement({ level, style })}
      {eloRangeElement({ from: eloFrom, to: eloTo, style })}
    </div>
  )
}

export default async parentElement => {
  const profileElement = select('section.profile > div.profile', parentElement)

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, profileElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, profileElement)

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
    <section>
      <h2 className="header-text-3 heading-border">Level Progress</h2>
      <div className="row flex flex-stretch">
        <div className="col-lg-4 flex-column-stretch">
          {keyStatElement({
            key: 'Level',
            stat: createSkillLevelElement({ level: currentLevel })
          })}
        </div>
        <div className="col-lg-4 flex-column-stretch">
          {keyStatElement({ key: 'Elo', stat: faceitElo })}
        </div>
        <div className="col-lg-4 flex-column-stretch">
          {currentLevel === 10
            ? keyStatElement({ key: `Maximum level reached`, stat: '🔥' })
            : keyStatElement({
                key: `Points needed to reach level ${currentLevel + 1}`,
                stat: LEVELS[currentLevel + 1][0] - faceitElo
              })}
        </div>
      </div>
      <div>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '92%' }}>
            <div style={{ height: 5, background: '#323737' }}>
              <div
                style={{
                  width: progressWidth > 100 ? '100%' : `${progressWidth}%`,
                  height: '100%',
                  background: '#f50'
                }}
              />
            </div>
            <div style={{ display: 'flex' }}>
              {skillLevelElement({
                level: 1,
                currentLevel,
                eloFrom: 1,
                eloTo: 800,
                width: 40
              })}
              {skillLevelElement({
                level: 2,
                currentLevel,
                eloFrom: 801,
                eloTo: 950
              })}
              {skillLevelElement({
                level: 3,
                currentLevel,
                eloFrom: 951,
                eloTo: 1100
              })}
              {skillLevelElement({
                level: 4,
                currentLevel,
                eloFrom: 1101,
                eloTo: 1250
              })}
              {skillLevelElement({
                level: 5,
                currentLevel,
                eloFrom: 1251,
                eloTo: 1400
              })}
              {skillLevelElement({
                level: 6,
                currentLevel,
                eloFrom: 1401,
                eloTo: 1550
              })}
              {skillLevelElement({
                level: 7,
                currentLevel,
                eloFrom: 1551,
                eloTo: 1700
              })}
              {skillLevelElement({
                level: 8,
                currentLevel,
                eloFrom: 1701,
                eloTo: 1850
              })}
              {skillLevelElement({
                level: 9,
                currentLevel,
                eloFrom: 1851,
                eloTo: 2000
              })}
            </div>
          </div>
          <div style={{ width: '8%' }}>
            <div
              style={{
                width: '100%',
                height: 5,
                background: progressWidth > 100 ? '#f50' : '#323737'
              }}
            />
            {skillLevelElement({
              level: 10,
              currentLevel,
              eloFrom: 2001,
              eloTo: '∞',
              width: 100,
              borderRight: false
            })}
          </div>
        </div>
      </div>
    </section>
  )

  profileElement.prepend(<hr className="full-hr full-hr--md" />)
  profileElement.prepend(levelProgressElement)
}
