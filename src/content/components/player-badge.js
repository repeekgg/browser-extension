/** @jsx h */
import { h } from 'dom-chef'

export default ({ role, bgColor, textColor, description }) => (
  <span
    className="label label-primary"
    style={{ 'background-color': bgColor, color: textColor }}
    title={description}
  >
    FACEIT Enhancer {role}
  </span>
)
