/** @jsx h */
import { h } from 'dom-chef'

export default ({ elo }) => (
  <span className="text-muted ellipsis-b">Elo: {elo || '–'}</span>
)
