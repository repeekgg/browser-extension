/** @jsx h */
import { h } from 'dom-chef'

export default ({ country, alignRight = false }) => (
  <img
    src={`https://cdn-frontend.faceit.com/web/112-1536332382/src/app/assets/images-compress/flags/${country.toUpperCase()}.png`}
    className="flag--12"
    style={{
      [`margin-${alignRight ? 'left' : 'right'}`]: 6,
      'vertical-align': 'unset'
    }}
  />
)
