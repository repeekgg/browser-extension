/** @jsx h */
import { h } from 'dom-chef'

export default ({ elo, alignedLeft }) => (
  <div
    className="text-light"
    style={{
      display: 'flex',
      'align-items': 'center',
      'justify-content': !alignedLeft && 'flex-end'
    }}
  >
    <span className="text-muted">Elo:&nbsp;</span>
    {elo || '–'}
  </div>
)
