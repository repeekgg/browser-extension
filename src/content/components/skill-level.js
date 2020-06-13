/** @jsx h */
/* eslint-disable react/no-danger */
import { h } from 'dom-chef'

const reqSkillLevel = require.context('../assets/skill-levels', false, /\.svg$/)

export default ({ level, size = 32, style = {} }) => (
  <span
    title={`Skill Level ${level}`}
    style={{ width: size, ...style }}
    dangerouslySetInnerHTML={{ __html: reqSkillLevel(`./${level}.svg`) }}
  />
)
