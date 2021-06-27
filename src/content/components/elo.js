/** @jsx h */
import { h } from 'dom-chef'
import createIconElement from './icon'

export default ({ elo, className, alignRight = false, style = {} }) => {
  const eloElement = (
    <span
      className={className}
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
