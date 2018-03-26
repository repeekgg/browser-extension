/** @jsx h */
import { h } from 'dom-chef'

export default (elo, alignRight = false) => {
  const eloElement = (
    <span
      style={{
        display: 'flex',
        'align-items': 'center',
        [`margin-${alignRight ? 'left' : 'right'}`]: 4
      }}
    >
      <i
        className="icon-ELO-icon"
        style={{
          [`margin-${alignRight ? 'right' : 'left'}`]: 4,
          'margin-top': 2
        }}
      />
    </span>
  )

  eloElement[alignRight ? 'prepend' : 'append'](elo)

  return eloElement
}
