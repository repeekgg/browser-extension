/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getPlayer } from '../libs/faceit'
import { LEVELS } from '../libs/elo'
import { getPlayerId } from '../libs/players'

const FEATURE_ATTRIBUTE = 'level-progress'

const levelImageElement = (level, style = {}) => (
  <img
    src={`https://cdn.faceit.com/frontend/614/assets/images/skill-icons/skill_level_${level}_md.png`}
    alt={`Level ${level}`}
    style={style}
  />
)

const keyStatElement = (key, stat) => (
  <div className="key-stat well" style={{ height: '100%' }}>
    <div className="key-stat__value text-gray">{stat}</div>
    {key}
  </div>
)

const eloRangeElement = (from, to, style) => (
  <div className="text-md" style={{ 'margin-top': 2, ...style }}>
    {from} – {to}
  </div>
)

const levelElement = ({
  level,
  currentLevel,
  eloFrom,
  eloTo,
  width = 7.5,
  borderRight = true
}) => {
  const style = { opacity: currentLevel === level ? 1 : 0.6 }
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
      {levelImageElement(level, style)}
      {eloRangeElement(eloFrom, eloTo, style)}
    </div>
  )
}

export default async parentElement => {
  const profileElement = select('section.profile > div.profile', parentElement)

  if (hasFeatureAttribute(profileElement, FEATURE_ATTRIBUTE)) {
    return
  }
  setFeatureAttribute(profileElement, FEATURE_ATTRIBUTE)

  const playerId = await getPlayerId()
  const player = await getPlayer(playerId)

  if (!player) {
    return
  }

  const { flag, games } = player
  const { skillLevel: currentLevel, faceitElo } = games[flag]
  const [_, levelMaxElo] = LEVELS[currentLevel] // eslint-disable-line no-unused-vars
  const progressWidth = faceitElo / 2000 * 100

  const levelProgressElement = (
    <section>
      <h2 className="header-text-3 heading-border">Level Progress</h2>
      <div className="row flex flex-stretch">
        <div className="col-lg-4 flex-column-stretch">
          {keyStatElement('Level', levelImageElement(currentLevel))}
        </div>
        <div className="col-lg-4 flex-column-stretch">
          {keyStatElement('Elo', faceitElo)}
        </div>
        <div className="col-lg-4 flex-column-stretch">
          {keyStatElement(
            `Points needed to reach level ${currentLevel + 1}`,
            levelMaxElo - faceitElo
          )}
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
              {levelElement({
                level: 1,
                currentLevel,
                eloFrom: 1,
                eloTo: 800,
                width: 40
              })}
              {levelElement({
                level: 2,
                currentLevel,
                eloFrom: 801,
                eloTo: 950
              })}
              {levelElement({
                level: 3,
                currentLevel,
                eloFrom: 951,
                eloTo: 1100
              })}
              {levelElement({
                level: 4,
                currentLevel,
                eloFrom: 1101,
                eloTo: 1250
              })}
              {levelElement({
                level: 5,
                currentLevel,
                eloFrom: 1251,
                eloTo: 1400
              })}
              {levelElement({
                level: 6,
                currentLevel,
                eloFrom: 1401,
                eloTo: 1550
              })}
              {levelElement({
                level: 7,
                currentLevel,
                eloFrom: 1551,
                eloTo: 1700
              })}
              {levelElement({
                level: 8,
                currentLevel,
                eloFrom: 1701,
                eloTo: 1850
              })}
              {levelElement({
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
            {levelElement({
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
