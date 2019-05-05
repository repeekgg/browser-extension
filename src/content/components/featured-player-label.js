/** @jsx h */
import { h } from 'dom-chef'

export default ({ role, bgColor, textColor }) => (
  <span
    className="label label-primary"
    style={{ 'background-color': bgColor, color: textColor }}
  >
    FACEIT Enhancer {role}
  </span>
)
