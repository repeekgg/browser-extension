/** @jsx h */
import { h } from 'dom-chef'

export default ({ key, stat }) => (
  <div
    style={{
      flex: 1,
      background: '#161616',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <div style={{ fontSize: 16, fontWeight: 'bold' }}>{stat}</div>
    <div style={{ textTransform: 'uppercase' }}>{key}</div>
  </div>
)
