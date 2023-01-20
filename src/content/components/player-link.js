import React from 'dom-chef'
import createIconElement from './icon'

export default ({ platform, url }) => {
  let platformIcon

  switch (platform) {
    case 'twitch': {
      platformIcon = 'ic_social_twitch_48px'
      break
    }
    default: {
      platformIcon = `ic-social-${platform}`
    }
  }

  return (
    <a
      className="match-team-member__controls__button"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {createIconElement({ icon: platformIcon, size: '' })}
    </a>
  )
}
