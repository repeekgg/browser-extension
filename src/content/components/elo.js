/** @jsx h */
import { h } from 'dom-chef'
import createIconElement from './icon'

export default ({ elo, alignRight = false, style = {} }) => {
  const eloElement = (
    <span
      style={{
        display: 'flex',
        'align-items': 'center',
        ...style
      }}
    >
      {createIconElement({
        icon: 'ELO-icon',
        style: {
          [`margin-${alignRight ? 'left' : 'right'}`]: 4,
          'margin-top': 2
        }
      })}
    </span>
  )

  eloElement[alignRight ? 'prepend' : 'append'](elo)

  return eloElement
}
