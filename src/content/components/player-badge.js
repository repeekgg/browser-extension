/** @jsx h */
import { h } from 'dom-chef'
import vipLevels from '../../shared/vip-levels'

export default ({ level = 0, role, bgColor, textColor, onClick }) => {
  let description

  switch (role) {
    case 'Creator': {
      description = 'Has created FACEIT Enhancer'
      break
    }
    case 'Developer': {
      description = 'Is part of FACEIT Enhancer developer team'
      break
    }
    case 'Code Contributor': {
      description = 'Has contributed to FACEIT Enhancer code'
      break
    }
    default: {
      description = `Has donated to FACEIT Enhancer${
        level > 0 ? ` at least ${level}0 Euros ` : ' '
      }to support the development`
    }
  }

  return (
    <span
      className="label"
      style={{
        background: bgColor || vipLevels[level].bgColor,
        color: textColor || vipLevels[level].textColor,
        cursor: 'help'
      }}
      title={description}
      onClick={onClick}
    >
      FACEIT Enhancer{' '}
      {role || `VIP ${level > 0 ? new Array(level).fill('★').join('') : ''}`}
    </span>
  )
}
