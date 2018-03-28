/** @jsx h */
import { h } from 'dom-chef'

export default ({ level, size = 'md', style = {} }) => (
  <img
    alt={`Skill Level ${level}`}
    src={`https://cdn.faceit.com/frontend/614/assets/images/skill-icons/skill_level_${level}_${size}.png`}
    style={style}
  />
)
