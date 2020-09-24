import select from 'select-dom'
import {
  getTeamElements,
  getRoomId,
  getTeamMemberElements,
  getNicknameElement,
  mapMatchNicknamesToPlayersMemoized
} from '../helpers/match-room'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import {
  getQuickMatch,
  getMatch,
  getUser,
  getSelf
} from '../helpers/faceit-api'
import createPlayerLink from '../components/player-link'
import { validateSocialLink } from '../helpers/social-media'

const FEATURE_ATTRIBUTE = 'player-links'

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const match = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  if (!match) {
    return
  }

  const nicknamesToPlayers = mapMatchNicknamesToPlayersMemoized(match)

  teamElements.forEach(async teamElement => {
    const memberElements = getTeamMemberElements(teamElement)

    memberElements.forEach(async memberElement => {
      if (hasFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)) {
        return
      }
      setFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)

      const nicknameElement = getNicknameElement(memberElement, isTeamV1Element)
      const nickname = nicknameElement.textContent
      const player = nicknamesToPlayers[nickname]

      let userId
      if (isTeamV1Element) {
        userId = player.guid
      } else {
        userId = player.id
      }

      const self = await getSelf()

      if (userId === self.guid) {
        return
      }

      const user = await getUser(userId)

      if (
        !user ||
        ((!user.socials || Object.keys(user.socials).length === 0) &&
          (!user.streaming || !user.streaming.twitchId))
      ) {
        return
      }

      const socialLinks = Object.keys(user.socials || [])
        .filter(
          platform =>
            user.socials[platform].value && user.socials[platform].value !== ''
        )
        .filter(platform =>
          validateSocialLink(platform, user.socials[platform].value)
        )
        .map(platform => ({
          url: user.socials[platform].value,
          platform
        }))

      if (user.streaming && user.streaming.twitchId) {
        socialLinks.push({
          platform: 'twitch',
          url: `https://twitch.tv/${user.streaming.twitchId}`
        })
      }

      if (socialLinks.length === 0) {
        return
      }

      const memberControlElement = select(
        '.match-team-member__controls>a',
        memberElement
      )

      for (const link of socialLinks) {
        const linkElement = createPlayerLink(link)

        memberControlElement.insertAdjacentElement('afterend', linkElement)
      }
    })
  })
}
