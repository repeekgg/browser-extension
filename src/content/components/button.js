import React from 'dom-chef'

export default ({ text, style = {}, ...props }) => (
  <button
    {...props}
    style={{
      background: '#484848',
      border: 'none',
      color: '#fff',
      fontWeight: 'bold',
      padding: '8px 16px',
      borderRadius: 4,
      textTransform: 'uppercase',
      cursor: 'pointer',
      ...style,
    }}
    type="button"
  >
    {text}
  </button>
)
