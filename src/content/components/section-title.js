/** @jsx h */
import { h } from 'dom-chef'

export default ({ title }) => (
  <div
    style={{
      fontWeight: 'bold',
      marginBottom: 16,
      textTransform: 'uppercase'
    }}
  >
    {title}
  </div>
)
