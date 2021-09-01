/** @jsx h */
/* eslint-disable react/no-danger */
import { h } from 'dom-chef'
import { getName } from 'country-list'

const reqFlag = require.context('../assets/flags', false, /\.svg$/)

export default ({ country, alignedRight = false }) => {
  const countryName = getName(country.toUpperCase()) || ''

  return (
    <span
      style={{
        width: 14,
        display: 'inline-block',
        [`margin-${alignedRight ? 'left' : 'right'}`]: 6
      }}
      title={countryName}
      dangerouslySetInnerHTML={{
        __html: reqFlag(`./${country.toLowerCase()}.svg`)
      }}
    />
  )
}
