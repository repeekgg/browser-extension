/** @jsx h */
import { h } from 'dom-chef'
import vipLevels from '../../shared/vip-levels'

export default ({
  level = 0,
  role,
  bgColor,
  textColor,
  description = '',
  onClick
}) => (
  <span
    className="label label-primary"
    style={{
      background: bgColor || vipLevels[level].bgColor,
      color: textColor || vipLevels[level].textColor,
      cursor: 'help'
    }}
    title={
      description ||
      `Has donated to FACEIT Enhancer${
        level > 0 ? ` at least ${level}0 Euros ` : ' '
      }to support the development.`
    }
    onClick={onClick}
  >
    FACEIT Enhancer{' '}
    {role || `VIP ${level > 0 ? new Array(level).fill('★').join('') : ''}`}
  </span>
)
