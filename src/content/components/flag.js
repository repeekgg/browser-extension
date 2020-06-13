/** @jsx h */
/* eslint-disable react/no-danger */
import { h } from 'dom-chef'
import { getName } from 'country-list'

const reqFlag = require.context('../assets/flags', false, /\.svg$/)

export default ({ country, alignedRight = false }) => {
  const countryName = getName(country) || ''

  return (
    <span
      style={{
        width: 12,
        display: 'inline-block',
        [`margin-${alignedRight ? 'left' : 'right'}`]: 4
      }}
      title={countryName}
      dangerouslySetInnerHTML={{ __html: reqFlag(`./${country}.svg`) }}
    />
  )
}
