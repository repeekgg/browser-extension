import select from 'select-dom'

import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'

import { getPlayerProfileNickname } from '../helpers/player-profile'
import { getPlayer } from '../helpers/faceit-api'
import { validateSocialLink, getPlatformFromTab } from '../helpers/social-media'

const FEATURE_ATTRIBUTE = 'profile-links'

export default async parentElement => {
  const socialTabsElement = select('div.social-tabs > ul.nav', parentElement)

  if (socialTabsElement === null) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, socialTabsElement)) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, socialTabsElement)

  const nickname = getPlayerProfileNickname()
  const profile = await getPlayer(nickname)

  if (
    !profile ||
    !profile.socials ||
    Object.keys(profile.socials).length === 0
  ) {
    return
  }

  const invalidLinks = Object.keys(profile.socials)
    .filter(
      platform =>
        profile.socials[platform].value &&
        profile.socials[platform].value !== ''
    )
    .filter(
      platform => !validateSocialLink(platform, profile.socials[platform].value)
    )

  if (invalidLinks.length === 0) {
    return
  }

  for (const socialElement of socialTabsElement.children) {
    const platform = getPlatformFromTab(socialElement.getAttribute('ng-class'))

    if (platform === null) {
      continue
    }

    if (
      invalidLinks.includes(platform) &&
      !socialElement.classList.contains('disabled')
    ) {
      socialElement.classList.add('disabled')

      const linkElement = select('a', socialElement)
      linkElement.removeAttribute('href')
    }
  }
}
