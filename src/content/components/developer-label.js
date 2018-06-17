/** @jsx h */
import { h } from 'dom-chef'

export default ({ alignRight = false }) => {
  const labelStyles = {
    'margin-top': '5px',
    'margin-bottom': '-5px'
  }

  if (alignRight) {
    labelStyles['margin-right'] = '52px'
    labelStyles['margin-left'] = 'auto'
  } else {
    labelStyles['margin-right'] = 'auto'
    labelStyles['margin-left'] = '52px'
  }

  return (
    <div
      style={{
        background: '#1b1b1f',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'space-between'
      }}
    >
      <span style={labelStyles} className="label label-primary">
        FACEIT Enhancer Dev
      </span>
    </div>
  )
}
