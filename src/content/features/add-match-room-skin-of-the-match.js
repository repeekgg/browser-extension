import React from 'dom-chef'
import select from 'select-dom'
import hexToRgba from 'hex-to-rgba'
import browser from 'webextension-polyfill'
import { ACTION_FETCH_SKIN_OF_THE_MATCH } from '../../shared/constants'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { getRoomId } from '../helpers/match-room'
import { getMatch } from '../helpers/faceit-api'
import countryToCurrency from '../helpers/country-to-currency'

const FEATURE_ATTRIBUTE = 'skin-of-the-match'

export default async parentElement => {
  const parasiteRootElement = select('#parasite-container', parentElement)
    .shadowRoot

  const matchRoomOverviewElement = select(
    '#MATCHROOM-OVERVIEW',
    parasiteRootElement
  )

  if (!matchRoomOverviewElement) {
    return
  }

  const infoColumnElement = select('[name="info"]', matchRoomOverviewElement)

  if (
    !infoColumnElement ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, infoColumnElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, infoColumnElement)

  const roomId = getRoomId()
  const match = await getMatch(roomId)

  if (!match || match.game !== 'csgo') {
    return
  }

  const players = [
    ...match.teams.faction1.roster,
    ...match.teams.faction2.roster
  ]

  const skinOfTheMatch = await browser.runtime.sendMessage({
    action: ACTION_FETCH_SKIN_OF_THE_MATCH,
    steamIds: players.map(({ gameId }) => gameId)
  })

  if (!skinOfTheMatch) {
    return
  }

  const skinOfTheMatchPlayer = players.find(
    ({ gameId }) => gameId === skinOfTheMatch.steam_id
  )

  if (!skinOfTheMatchPlayer) {
    return
  }

  const { locale } = new Intl.DateTimeFormat().resolvedOptions()
  const currency = countryToCurrency[locale.split('-').pop()] || 'USD'

  await new Promise(resolve => {
    const image = new Image()
    image.src = `${skinOfTheMatch.skin.image}/256x128`
    image.addEventListener('load', resolve)
  })

  const styles = (
    <style>
      {`@keyframes faceitEnhancerFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }`}
    </style>
  )

  const skinOfTheMatchElement = (
    <a
      href={`${skinOfTheMatch.skin.skinport_url ||
        'https://skinport.com'}?r=faceit-enhancer&utm_source=faceit-enhancer`}
      target="_blank"
      rel="noreferrer noopener"
      style={{
        color: 'inherit',
        animation: '0.5s ease-out faceitEnhancerFadeIn',
        position: 'relative',
        display: 'block',
        marginTop: 32,
        borderRadius: 4,
        border: '1px solid #303030'
      }}
    >
      <div
        style={{
          fontSize: 14,
          padding: 8,
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 2
              }}
            >
              FACEIT Enhancer
            </div>
            <div
              style={{
                fontWeight: 'bold',
                marginBottom: 8
              }}
            >
              Skin Of The Match
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 2
              }}
            >
              Buy on
            </div>
            <div style={{ width: 100 }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 100 13"
              >
                <g clipPath="url(#clip0_817_1952)">
                  <path
                    fill="#FA490A"
                    d="M20.63 1.105h2.995v2.996H20.63V1.105z"
                  />
                  <path
                    fill="#fff"
                    d="M27.743 1.104h2.585v11.56h-2.585V1.103zM43.57 8.546l-5.678-7.442h-2.407v11.56h2.585V5.426l5.513 7.236h2.586V1.103h-2.586v7.443h-.014zM5.718 5.727c-1.094-.273-1.792-.506-2.107-.697-.3-.205-.451-.465-.451-.807s.123-.602.37-.807c.246-.206.588-.301 1.012-.301 1.067 0 2.106.383 3.105 1.135l1.3-1.888A6.264 6.264 0 006.936 1.24 7.143 7.143 0 004.624.844c-1.177 0-2.162.3-2.941.889C.889 2.335.506 3.169.506 4.277c0 1.095.315 1.902.93 2.408.63.506 1.6.93 2.955 1.245.848.205 1.423.41 1.71.616a.954.954 0 01.424.82c0 .342-.136.63-.41.821-.274.205-.643.301-1.122.301-1.053 0-2.216-.547-3.46-1.642L0 10.762C1.464 12.116 3.119 12.8 4.938 12.8c1.273 0 2.285-.328 3.065-.971.78-.643 1.163-1.491 1.163-2.517 0-1.04-.301-1.82-.903-2.367-.602-.534-1.45-.944-2.545-1.218zM74.83 6.904a5.99 5.99 0 00-6.005-6.02 5.979 5.979 0 00-5.992 6.02 5.961 5.961 0 005.991 5.978 5.973 5.973 0 006.006-5.978zm-2.517-.027c.014 1.928-1.573 3.529-3.489 3.529-1.915 0-3.488-1.6-3.474-3.53a3.5 3.5 0 013.488-3.474c1.915-.014 3.475 1.546 3.475 3.475zM100 1.117h-9.37v2.271h3.529v9.275h2.585V3.388H100v-2.27zM60.356 5.262c0 2.791-1.806 4.392-4.788 4.392h-1.683v3.01H51.3V1.116h4.117c3.078 0 4.939 1.505 4.939 4.145zm-2.476.123c0-.875-.41-1.997-2.654-1.997h-1.327v4.008h1.477c1.998 0 2.504-1.135 2.504-2.01zM16.306 6.507l4.405 6.156h3.12l-4.406-6.156h-3.119zm-2.585-5.403v11.56h2.585V1.103h-2.585zm71.395 11.56l-2.161-3.01h-1.82v3.01H78.55V1.103l4.131.013c3.065 0 4.925 1.505 4.925 4.145 0 1.792-.739 3.092-2.066 3.79l2.586 3.611h-3.01zM81.15 7.395h1.477c2.011 0 2.504-1.135 2.504-1.997 0-.862-.41-1.997-2.654-1.997H81.15v3.994z"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_817_1952">
                    <path
                      fill="#fff"
                      d="M0 0H100V12.052H0z"
                      transform="translate(0 .844)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <img
            src={`${skinOfTheMatch.skin.image}/256x128`}
            style={{ width: '50%' }}
          />
          <div
            style={{
              display: 'flex',
              gap: 4,
              marginBottom: 2,
              color: 'rgba(255,255,255,0.6)',
              alignItems: 'center'
            }}
          >
            <img
              src={skinOfTheMatchPlayer.avatar}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#303030'
              }}
            />
            <div style={{ fontSize: 12 }}>{skinOfTheMatchPlayer.nickname}</div>
          </div>
          <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
            {skinOfTheMatch.skin.name}
          </div>
          <div style={{ textAlign: 'center' }}>
            {new Intl.NumberFormat(locale, {
              style: 'currency',
              currency
            }).format(skinOfTheMatch.skin.price[currency])}
          </div>
        </div>
      </div>
    </a>
  )

  parasiteRootElement.appendChild(styles)

  infoColumnElement.appendChild(skinOfTheMatchElement)

  setTimeout(() => {
    skinOfTheMatchElement.appendChild(
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 4,
          background: skinOfTheMatch.skin.color
            ? `radial-gradient(75% 75% at 50% 100%, ${hexToRgba(
                skinOfTheMatch.skin.color,
                0.25
              )} 0%, transparent 100%)`
            : undefined,
          animation: skinOfTheMatch.skin.color
            ? '0.5s ease-out faceitEnhancerFadeIn'
            : undefined,
          zIndex: 1
        }}
      />
    )
  }, 250)
}
