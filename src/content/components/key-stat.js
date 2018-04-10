/** @jsx h */
import { h } from 'dom-chef'

export default ({ key, stat }) => (
  <div className="key-stat well" style={{ height: '100%' }}>
    <div className="key-stat__value text-gray">{stat}</div>
    {key}
  </div>
)
