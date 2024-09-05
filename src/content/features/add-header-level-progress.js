import React from 'dom-chef'
import select from 'select-dom'
import createSkillLevelElement from '../components/skill-level'
import { isFaceitNext } from '../helpers/dom-element'
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
  const anchorElement = select(
    isFaceitNext()
      ? '#main-header-height-wrapper div[class*="styles__ProfileContainer"], div[class*="styles__SideBarTrayHeaderWrapper"]:has(div[class*="styles__AvatarControlWrapper"]) div[class*="styles__BottomAreaWrapper"]'
      : '#main-header-height-wrapper a[href*="/players/"]:has(div > div:nth-child(2) > span + div > i + span',
  )

  if (
    !anchorElement?.parentElement ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, anchorElement.parentElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, anchorElement.parentElement)

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

    const isNewNavigation = anchorElement.className.includes(
      'styles__BottomAreaWrapper',
    )

    const levelElement = (
      <div>
        <a href={createPathname(selfStatsPathname)}>
          <div
            style={{
              display: 'flex',
              fontSize: isNewNavigation ? undefined : 12,
              color: 'rgba(255,255,255,0.6)',
              alignItems: 'center',
              marginRight: 16,
              marginLeft: 16,
              marginBottom: isNewNavigation ? 16 : undefined,
            }}
          >
            {createSkillLevelElement({
              level: skillLevel,
            })}
            <div
              style={{
                'margin-left': isNewNavigation ? 8 : 4,
                flex: isNewNavigation ? 1 : undefined,
              }}
            >
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
                    marginTop: isNewNavigation ? 4 : 1,
                    marginBottom: isNewNavigation ? 4 : 1,
                    height: 2,
                    width: isNewNavigation ? undefined : 120,
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
                    fontSize: isNewNavigation ? 14 : 10,
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
      </div>
    )

    anchorElement.insertAdjacentElement('beforebegin', levelElement)

    setTimeout(() => {
      levelElement.remove()
      addLevelElement({ memoized: false })
    }, REFRESH_TIME)
  }

  addLevelElement()
}
