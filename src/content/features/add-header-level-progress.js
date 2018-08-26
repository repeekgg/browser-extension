/** @jsx h */
import select from 'select-dom'
import { h } from 'dom-chef'
import { CACHE_TIME, getSelf } from '../libs/faceit'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { LEVELS } from '../libs/elo'
import createSkillLevelElement from '../components/skill-level'
import { isLoggedIn } from '../libs/utils'

const FEATURE_ATTRIBUTE = 'own-level'
const REFRESH_TIME = CACHE_TIME + 15000

export default async () => {
  if (!isLoggedIn()) {
    return
  }

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

    const { flag, games, nickname } = self
    const { skillLevel, faceitElo } = games[flag]
    const [levelMinElo, levelMaxElo] = LEVELS[skillLevel]

    const progressWidth = levelMaxElo
      ? `${(faceitElo - levelMinElo) / (levelMaxElo - levelMinElo) * 100}%`
      : '100%'

    const levelBelow = LEVELS[skillLevel - 1]
    const levelAbove = LEVELS[skillLevel + 1]

    const levelBelowEloDiff = levelBelow ? `-${faceitElo - levelBelow[1]}` : 0
    const levelAboveEloDiff = levelMaxElo
      ? `+${levelAbove[0] - faceitElo}`
      : '∞'

    levelElement = (
      <a href={`https://www.faceit.com/en/players/${nickname}`}>
        <div
          style={{
            display: 'flex',
            'align-items': 'center',
            'margin-right': 8,
            'margin-left': 24
          }}
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
                  {levelBelowEloDiff}/{levelAboveEloDiff}
                </span>
                <span>{levelMaxElo ? levelMaxElo : '∞'}</span>
              </div>
            </div>
          </div>
          {createSkillLevelElement({ level: skillLevel })}
        </div>
      </a>
    )

    headerRightElement.insertBefore(
      levelElement,
      headerRightElement.children[headerRightElement.children.length - 1]
    )
  }

  addLevelElement()

  setInterval(() => {
    levelElement.remove()
    addLevelElement()
  }, REFRESH_TIME)
}
