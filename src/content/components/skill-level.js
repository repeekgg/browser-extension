/** @jsx h */
import { h } from 'dom-chef'

export default ({ level, size = 32, style = {} }) => (
  <img
    alt={`Skill Level ${level}`}
    height={size}
    src={`https://cdn-frontend.faceit.com/web/960/src/app/assets/images-compress/skill-icons/skill_level_${level}_svg.svg`}
    style={style}
    width={size}
  />
)
