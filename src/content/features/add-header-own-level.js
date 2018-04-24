/** @jsx h */
import select from 'select-dom'
import { h } from 'dom-chef'
import { CACHE_TIME, getSelf } from '../libs/faceit'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { LEVELS } from '../libs/elo'
import createSkillLevelElement from '../components/skill-level'

const FEATURE_ATTRIBUTE = 'own-level'
const REFRESH_TIME = CACHE_TIME + 15000

export default async () => {
  const headerRightElement = select('.main-header__right')

  if (!headerRightElement) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, headerRightElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, headerRightElement)

  let levelElement

  const addLevelElement = async () => {
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

    levelElement = (
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
                -{faceitElo - LEVELS[skillLevel - 1][1]}/{levelMaxElo
                  ? `+${LEVELS[skillLevel + 1][0] - faceitElo}`
                  : '∞'}
              </span>
              <span>{levelMaxElo ? levelMaxElo : '∞'}</span>
            </div>
          </div>
        </div>
        {createSkillLevelElement({ level: skillLevel })}
      </div>
    )

    headerRightElement.prepend(levelElement)
  }

  addLevelElement()

  setInterval(() => {
    levelElement.remove()
    addLevelElement()
  }, REFRESH_TIME)
}
