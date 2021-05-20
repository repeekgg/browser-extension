/** @jsx h */
import { h } from 'dom-chef'

const stat = (value, label, worse, paddingTop = true) => (
  <div
    title={label}
    style={{
      flex: 1,
      color: worse ? 'red' : 'green',
      'padding-top': paddingTop && '5px',
      'padding-bottom': '5px'
    }}
  >
    {value}
  </div>
)

const winRateLabel = 'Average win rate in the last 20 matches'
const mapsCountLabel =
  'Average number of maps played by one player in the last 20 matches'

const statsVerticalDivider = () => (
  <div style={{ width: 1, background: '#333' }} />
)

export default ([
  { percent, mapsCount },
  { percent: percent2, mapsCount: mapsCount2 }
]) => (
  <div
    className="text-muted"
    style={{
      display: 'flex',
      'border-top': '1px solid #333',
      'font-size': 12,
      'line-height': 12,
      padding: '0px 9px'
    }}
  >
    <div style={{ flex: 2 }}>
      <div>
        {stat(`Win Rate: ${percent}%`, winRateLabel, percent < percent2)}
      </div>
      {stat(
        `Maps: ${mapsCount}`,
        mapsCountLabel,
        mapsCount < mapsCount2,
        false
      )}
    </div>
    {statsVerticalDivider()}
    <div style={{ flex: 2, textAlign: 'right' }}>
      <div>
        {stat(`Win Rate: ${percent2}%`, winRateLabel, percent2 < percent)}
      </div>
      <div>
        {stat(
          `Maps: ${mapsCount2}`,
          mapsCountLabel,
          mapsCount2 < mapsCount,
          false
        )}
      </div>
    </div>
  </div>
)
