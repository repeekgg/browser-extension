/** @jsx h */
import { h } from 'dom-chef'

export default ({ averageElo, totalElo }) => (
  <span
    className="text-muted"
    style={{ display: 'block', 'margin-top': 6, 'font-size': 14 }}
  >
    Avg. Elo: {averageElo}
    <br />
    Total Elo: {totalElo}
  </span>
)
