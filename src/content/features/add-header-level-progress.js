import React from 'dom-chef'
import select from 'select-dom'
import { IS_FACEIT_BETA } from '../../shared/faceit-beta'
import createSkillLevelElement from '../components/skill-level'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { SKILL_LEVELS_BY_GAME } from '../helpers/elo'
import { getSelf } from '../helpers/faceit-api'
import { createPathname } from '../helpers/navigation'

const FEATURE_ATTRIBUTE = 'level-progress'
const REFRESH_TIME = 300000 // 5 Minutes

export default async () => {
  const headerUserElement = select(
    '#main-header-height-wrapper a[href*="/players/"]:has(div > div:nth-child(2) > span + div > i + span',
  )

  if (
    !headerUserElement?.parentElement ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, headerUserElement.parentElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, headerUserElement.parentElement)

  const addLevelElement = async ({ memoized } = {}) => {
    const self = await getSelf({ memoized })

    if (!self) {
      return
    }

    const { flag: game, games, nickname } = self

    const skillLevels = SKILL_LEVELS_BY_GAME[game]

    if (!skillLevels) {
      return
    }

    const { skillLevel, faceitElo = 1000 } = games[game]
    const [levelMinElo, levelMaxElo] = skillLevels[skillLevel]

    const progressWidth = levelMaxElo
      ? `${((faceitElo - levelMinElo) / (levelMaxElo - levelMinElo)) * 100}%`
      : '100%'

    const levelBelow = skillLevels[skillLevel - 1]
    const levelAbove = skillLevels[skillLevel + 1]

    const levelBelowEloDiff = levelBelow ? `-${faceitElo - levelBelow[1]}` : 0
    const levelAboveEloDiff = levelMaxElo
      ? `+${levelAbove[0] - faceitElo}`
      : '∞'

    const selfStatsPathname = `players/${nickname}/stats/${game}`

    const levelElement = (
      <a href={createPathname(selfStatsPathname)}>
        <div
          style={{
            display: 'flex',
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            alignItems: 'center',
            marginRight: 8,
            marginLeft: 4,
          }}
        >
          {createSkillLevelElement({
            level: skillLevel,
          })}
          <div style={{ 'margin-left': 4 }}>
            <div
              style={{
                display: 'flex',
                'justify-content': 'space-between',
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  'align-items': 'center',
                  'justify-content': 'flex-end',
                  gap: 4,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="none"
                  color="secondary"
                  viewBox="0 0 24 12"
                >
                  <title>Elo Icon</title>
                  <path
                    fill="rgba(255,255,255,0.6)"
                    d="M12 3c0 .463-.105.902-.292 1.293l1.998 2A2.97 2.97 0 0 1 15 6a2.99 2.99 0 0 1 1.454.375l1.921-1.921a3 3 0 1 1 1.5 1.328l-2.093 2.093a3 3 0 1 1-5.49-.168l-1.999-2a2.992 2.992 0 0 1-2.418.074L5.782 7.876a3 3 0 1 1-1.328-1.5l1.921-1.921A3 3 0 1 1 12 3z"
                  />
                </svg>
                {faceitElo}
              </div>
              <div>{game.toUpperCase()}</div>
            </div>
            <div>
              <div
                style={{
                  marginTop: 1,
                  height: 2,
                  width: 120,
                  background: '#4b4e4e',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: progressWidth,
                    background: '#f50',
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  'justify-content': 'space-between',
                  fontSize: 10,
                }}
              >
                {levelMinElo}
                <span>
                  {levelBelowEloDiff}/{levelAboveEloDiff}
                </span>
                <span>{levelMaxElo ? levelMaxElo : '∞'}</span>
              </div>
            </div>
          </div>
        </div>
      </a>
    )

    headerUserElement.insertAdjacentElement('beforebegin', levelElement)

    setTimeout(() => {
      levelElement.remove()
      addLevelElement({ memoized: false })
    }, REFRESH_TIME)
  }

  addLevelElement()
}
