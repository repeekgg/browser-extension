/** @jsx h */
import { h } from 'dom-chef'

export default ({ role, bgColor, textColor, description = '', onClick }) => (
  <span
    className="label label-primary"
    style={{ 'background-color': bgColor, color: textColor, cursor: 'help' }}
    title={description}
    onClick={onClick}
  >
    FACEIT Enhancer {role}
  </span>
)
