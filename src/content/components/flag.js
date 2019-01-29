/** @jsx h */
import { h } from 'dom-chef'
import { getName } from 'country-list'

export default ({ country, alignRight = false }) => {
  const countryCode = country.toUpperCase()
  const countryName = getName(countryCode) || ''

  return (
    <img
      src={`https://cdn-frontend.faceit.com/web/112-1536332382/src/app/assets/images-compress/flags/${countryCode}.png`}
      className="flag--12"
      style={{
        [`margin-${alignRight ? 'left' : 'right'}`]: 6,
        'vertical-align': 'unset'
      }}
      alt={countryName}
      title={countryName}
    />
  )
}
