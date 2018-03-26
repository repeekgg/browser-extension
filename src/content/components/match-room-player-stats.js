/** @jsx h */
import { h } from 'dom-chef'

const stat = (value, label) => (
  <div style={{ flex: 1, padding: '5px 9px' }}>
    {value}
    <div className="text-sm">{label}</div>
  </div>
)

const statsVerticalDivider = () => (
  <div style={{ width: 1, background: '#333' }} />
)

export default (
  {
    matches,
    winRate,
    averageKDRatio,
    averageKills,
    averageKRRatio,
    averageHeadshots
  },
  alignRight = false
) => (
  <div
    className="text-muted"
    style={{
      display: 'flex',
      background: '#1b1b1f',
      'border-top': '1px solid #333',
      'text-align': alignRight && 'right',
      'font-size': 12,
      'line-height': 12
    }}
  >
    {stat(`${matches} / ${winRate}%`, 'Matches / Wins')}
    {statsVerticalDivider()}
    {stat(`${averageKills} / ${averageHeadshots}%`, 'Avg. Kills / HS')}
    {statsVerticalDivider()}
    {stat(`${averageKDRatio} / ${averageKRRatio}`, 'Avg. K/D / K/R')}
  </div>
)
