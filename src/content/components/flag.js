/** @jsx h */
import { h } from 'dom-chef'

export default ({ country, alignRight = false }) => (
  <img
    src={`https://cdn.faceit.com/frontend/561/assets/images/flags/${country.toUpperCase()}.png`}
    className="flag--12"
    style={{
      [`margin-${alignRight ? 'left' : 'right'}`]: 6,
      'vertical-align': 'unset'
    }}
  />
)
