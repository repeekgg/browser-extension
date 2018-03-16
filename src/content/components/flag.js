/** @jsx h */
import { h } from 'dom-chef'

export default ({ alignedLeft = true, country }) => (
  <img
    src={`https://cdn.faceit.com/frontend/561/assets/images/flags/${country.toUpperCase()}.png`}
    className="flag--12"
    style={{
      [`margin-${alignedLeft ? 'right' : 'left'}`]: 6,
      'vertical-align': 'unset'
    }}
  />
)
