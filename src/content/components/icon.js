/** @jsx h */
import { h } from 'dom-chef'

export default ({ icon, size }) => (
  <i
    className={`icon-${icon} text-light`}
    style={size && { 'font-size': size }}
  />
)
