import React from 'dom-chef'
import select from 'select-dom'
import createEloElement from '../components/elo'
import createFlagElement from '../components/flag'
import createFeaturedPlayerBadgeElement from '../components/player-badge'
import createSkillLevelElement from '../components/skill-level'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getPlayer, getTeam } from '../helpers/faceit-api'
import { getPlayerBadges } from '../helpers/player-badges'
import {
  getTeamId,
  getTeamMemberNicknameElement,
  getTeamMemberPlayerElements,
} from '../helpers/team-page'

const FEATURE_ATTRIBUTE = 'team-player-stats'

export default async (parentElement) => {
  const teamId = getTeamId()

  const team = await getTeam(teamId)

  if (!team) {
    return
  }

  const memberElements = getTeamMemberPlayerElements(parentElement)

  const badges = await getPlayerBadges(team.members.map(({ guid }) => guid))

  for (const memberElement of memberElements) {
    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)) {
      return
    }

    setFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)

    const nicknameElement = getTeamMemberNicknameElement(memberElement)
    const nickname = nicknameElement.textContent

    const player = await getPlayer(nickname)

    if (!player) {
      return
    }

    const { country, csgoName, games, csgoSkillLevel } = player

    const memberDetailsElement = select('.users-list__details', memberElement)

    if (badges[player.id]) {
      const featuredPlayerBadgeElement = createFeaturedPlayerBadgeElement(
        badges[player.id],
      )

      memberDetailsElement.insertAdjacentElement(
        'afterbegin',
        <div style={{ 'margin-bottom': 2 }}>{featuredPlayerBadgeElement}</div>,
      )
    }

    if (csgoName) {
      memberDetailsElement.appendChild(
        <span className="text-muted" style={{ display: 'block' }}>
          {csgoName}
        </span>,
      )
    }

    if (games?.csgo) {
      const elo = games.csgo.faceitElo || '–'

      memberElement.children[0].appendChild(
        <div
          style={{
            display: 'flex',
            flexShrink: 0,
          }}
        >
          {createEloElement({
            elo,
            className: 'text-muted text-md',
            alignRight: true,
            style: { 'margin-right': 4 },
          })}
          {createSkillLevelElement({ level: csgoSkillLevel || 0 })}
        </div>,
      )
    }

    const flagElement = createFlagElement({ country })
    nicknameElement.prepend(flagElement)
  }
}
