/** @jsx h */
import { h } from 'dom-chef'

const stat = (value, label, flex = 1) => (
  <div style={{ flex, padding: '5px 9px' }}>
    {value}
    <div className="text-sm">{label}</div>
  </div>
)

const statsVerticalDivider = () => (
  <div style={{ width: 1, background: '#333' }} />
)

export default ({
  matches,
  winRate,
  averageKDRatio,
  averageKills,
  averageKRRatio,
  averageHeadshots,
  alignRight = false
}) => (
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
    <div>
      <div
        className="text-sm"
        style={{ 'border-bottom': '1px solid #333', padding: '5px 9px' }}
      >
        Overall
      </div>
      {stat(matches, 'Matches', 0)}
    </div>
    {statsVerticalDivider()}
    <div style={{ flex: 4 }}>
      <div
        className="text-sm"
        style={{ 'border-bottom': '1px solid #333', padding: '5px 9px' }}
      >
        Last 20 Matches
      </div>
      <div style={{ display: 'flex' }}>
        {stat(`${winRate}%`, 'Win Rate')}
        {statsVerticalDivider()}
        {stat(`${averageKills} / ${averageHeadshots}%`, 'Avg. Kills / HS')}
        {statsVerticalDivider()}
        {stat(`${averageKDRatio} / ${averageKRRatio}`, 'Avg. K/D / K/R')}
      </div>
    </div>
  </div>
)
