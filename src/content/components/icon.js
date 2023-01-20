import React from 'dom-chef'

export default ({ icon, size, textLight = false, style = {} }) => (
  <i
    className={`icon-${icon} ${textLight && 'text-light'}`}
    style={{ 'font-size': size, ...style }}
  />
)
