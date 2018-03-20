/** @jsx h */
import select from 'select-dom'
import { h } from 'dom-chef'
import { getSelf } from '../libs/faceit'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'

const LEVELS = {
  1: [1, 800],
  2: [801, 950],
  3: [951, 1100],
  4: [1101, 1250],
  5: [1251, 1400],
  6: [1401, 1550],
  7: [1551, 1700],
  8: [1701, 1850],
  9: [1851, 2000],
  10: [2001, null]
}

const FEATURE_ATTRIBUTE = 'own-elo'

export default async parent => {
  const userElement = select('.main-header__right', parent)

  if (!userElement) {
    return
  }

  if (hasFeatureAttribute(userElement, FEATURE_ATTRIBUTE)) {
    return
  }
  setFeatureAttribute(userElement, FEATURE_ATTRIBUTE)

  const self = await getSelf()

  if (!self) {
    return
  }

  const { flag, games } = self
  const { skillLevel, faceitElo } = games[flag]
  const [levelMinElo, levelMaxElo] = LEVELS[skillLevel]

  const progressWidth = levelMaxElo
    ? `${(faceitElo - levelMinElo) / (levelMaxElo - levelMinElo) * 100}%`
    : '100%'

  const eloElement = (
    <div
      style={{ display: 'flex', 'align-items': 'center', 'margin-right': 10 }}
    >
      <div style={{ 'margin-right': 4 }}>
        <div
          className="text-light"
          style={{
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'flex-end'
          }}
        >
          {faceitElo}
          <i
            className="icon-ELO-icon text-light"
            style={{ 'margin-left': 4 }}
          />
        </div>
        <div>
          <div
            style={{
              margin: '1px 0',
              height: 2,
              width: 110,
              background: '#4b4e4e'
            }}
          >
            <div
              style={{
                height: '100%',
                width: progressWidth,
                background: '#f50'
              }}
            />
          </div>
          <div
            className="text-sm text-muted bold"
            style={{ display: 'flex', 'justify-content': 'space-between' }}
          >
            {levelMinElo}
            <span>
              -{faceitElo - levelMinElo}/{levelMaxElo
                ? `+${levelMaxElo - faceitElo}`
                : '∞'}
            </span>
            <span>{levelMaxElo ? levelMaxElo : '∞'}</span>
          </div>
        </div>
      </div>
      <img
        src={`https://cdn.faceit.com/frontend/614/assets/images/skill-icons/skill_level_${skillLevel}_md.png`}
      />
    </div>
  )

  userElement.prepend(eloElement)
}
