import React from 'dom-chef'
import select from 'select-dom'
import browser from 'webextension-polyfill'
import { ACTION_FETCH_SKIN_OF_THE_MATCH } from '../../shared/constants'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { getRoomId } from '../helpers/match-room'
import { getMatch, getSelf } from '../helpers/faceit-api'
import storage from '../../shared/storage'

const FEATURE_ATTRIBUTE = 'skin-of-the-match'

export default async () => {
  const { matchRoomSkinOfTheMatch } = await storage.getAll()

  if (matchRoomSkinOfTheMatch === false) {
    return
  }

  const matchRoomOverviewElement = select('#MATCHROOM-OVERVIEW')

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
  const [match, self] = await Promise.all([getMatch(roomId), getSelf()])

  if (!match || match.game !== 'csgo') {
    return
  }

  const players = [
    ...match.teams.faction1.roster,
    ...match.teams.faction2.roster
  ]

  const skinOfTheMatch = await browser.runtime.sendMessage({
    action: ACTION_FETCH_SKIN_OF_THE_MATCH,
    steamIds: players.map(({ gameId }) => gameId),
    matchId: match.id
  })

  if (!skinOfTheMatch) {
    return
  }

  const skinNameMatch = skinOfTheMatch.skin.name.match(/(.+) \((.+)\)/)

  if (skinNameMatch) {
    skinOfTheMatch.skin.name = skinNameMatch[1]
    skinOfTheMatch.skin.exterior = skinNameMatch[2]
  }

  const skinOfTheMatchPlayer = players.find(
    ({ gameId }) => gameId === skinOfTheMatch.steam_id
  )

  if (!skinOfTheMatchPlayer) {
    return
  }

  const isSelfSkinOfTheMatchPlayer = skinOfTheMatchPlayer.id === self.id

  const styles = (
    <style>
      {`@keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .tooltip {
          display: none;
          position: absolute;
          bottom: calc(100% + 4px);
          left: 0;
          right: 0;
          opacity: 0;
          animation: 250ms ease-out fadeIn;
        }

        .tooltipTrigger:hover .tooltip {
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 1;
        }

        @keyframes spotlightFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 0.075;
          }
        }

        .spotlight {
          opacity: 0.075;
        }
        
        .spotlightTrigger:hover .spotlight {
          opacity: 0.15;
        }

        @keyframes rotateSkin {
          from {
            transform: translate(0);
            filter: saturate(1.25) brightness(1.25) drop-shadow(0px 4px 3px black);
          }

          50% {
            transform: translate(0, -4px);
            filter: saturate(1.25) brightness(1.25) drop-shadow(0px 8px 7px black);
          }

          100% {
            transform: translate(0);
            filter: saturate(1.25) brightness(1.25) drop-shadow(0px 4px 3px black);
          }
        }
        
        .skinImageTrigger:hover .skinImage {
          animation: 2.5s ease-in-out rotateSkin infinite;
        }`}
    </style>
  )

  const skinOfTheMatchElement = (
    <div
      className="tooltipTrigger spotlightTrigger skinImageTrigger"
      style={{
        position: 'relative',
        fontFamily:
          'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
      }}
    >
      <a
        href={`${skinOfTheMatch.skin.skinport_url ||
          'https://skinport.com'}?r=repeek&utm_source=repeek&utm_medium=browser_extension`}
        target="_blank"
        rel="noreferrer noopener"
        style={{
          color: 'inherit',
          animation: '500ms ease-out fadeIn',
          position: 'relative',
          display: 'block',
          marginTop: 32,
          fontSize: 12,
          textDecoration: 'none',
          borderRadius: 6,
          border: '1px solid rgb(64 64 64)',
          backgroundImage:
            'linear-gradient(to left top, rgb(10, 10, 10) 50%, rgb(23, 23, 23))'
        }}
      >
        <div
          style={{
            padding: 8,
            position: 'relative',
            zIndex: 2
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8
            }}
          >
            <div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: 2,
                  display: 'flex',
                  gap: 4,
                  alignItems: 'center'
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={107}
                  height={128}
                  fill="none"
                  viewBox="0 0 107 128"
                  style={{
                    height: 14,
                    width: 'auto',
                    fill: 'rgba(255,255,255,0.6)'
                  }}
                >
                  <path
                    fill="currentColor"
                    d="m39.343 69.778 4.795 10.993L46.012 63.9l-19.55-10.18v10.31l12.88 5.747Z"
                  />
                  <path
                    fill="currentColor"
                    d="M77.175 29.223 53.286 23.13v-.003L29.353 29.06 0 0l5.423 114.61 20.124-14.411 23.797 27.774-15.483-49.998-13.67 10.915-6.274-57.946 9.94 13.195 29.375-6.062v.002l29.337 6.26 10.06-13.395-6.698 58.172-13.597-11.008L56.513 128l23.986-27.613 20.024 14.548L106.724.363l-29.55 28.86Z"
                  />
                  <path
                    fill="currentColor"
                    d="M79.83 64.033v-10.31L60.276 63.9l1.876 16.873 4.794-10.992 12.882-5.748Z"
                  />
                </svg>
                <div>
                  Repeek{' '}
                  <span style={{ fontSize: 10 }}>
                    (formerly FACEIT Enhancer)
                  </span>
                </div>
              </div>
              <div
                style={{
                  fontWeight: 'bold'
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
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: 2
                }}
              >
                Powered by
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 100 13"
                style={{ height: 10 }}
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
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center'
            }}
          >
            <div style={{ width: '25%', display: 'flex' }}>
              <img
                src={`${skinOfTheMatch.skin.image}/256x128`}
                style={{
                  width: '100%',
                  filter:
                    'saturate(1.25) brightness(1.25) drop-shadow(0px 4px 3px black)'
                }}
                className="skinImage"
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2,
                maxWidth: '50%'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 4,
                  color: 'rgba(255,255,255,0.6)'
                }}
              >
                {skinOfTheMatchPlayer.avatar ? (
                  <img
                    src={skinOfTheMatchPlayer.avatar}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: '#303030'
                    }}
                  />
                )}
                <div
                  style={{
                    color: isSelfSkinOfTheMatchPlayer
                      ? skinOfTheMatch.skin.color
                      : undefined
                  }}
                >
                  {skinOfTheMatchPlayer.nickname}
                </div>
              </div>
              <div style={{ fontWeight: 'bold' }}>
                {skinOfTheMatch.skin.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>
                {skinOfTheMatch.skin.exterior}
                {skinOfTheMatch.skin.exterior && ' · '}
                {new Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: skinOfTheMatch.skin.price.currency
                }).format(skinOfTheMatch.skin.price.value)}
              </div>
            </div>
          </div>
        </div>
      </a>
      <div className="tooltip">
        <div
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 10,
            textAlign: 'center',
            borderRadius: 6,
            background: '#0a0a0a',
            padding: 8,
            maxWidth: 250
          }}
        >
          This feature is provided by Repeek (formerly FACEIT Enhancer) and not
          affiliated with FACEIT.
        </div>
        <span
          style={{
            border: '8px solid transparent',
            borderTop: '8px solid #0a0a0a',
            borderBottom: 0
          }}
        />
      </div>
    </div>
  )

  const skinOfTheMatchWrapper = document.createElement('div')
  skinOfTheMatchWrapper.attachShadow({ mode: 'open' })

  skinOfTheMatchWrapper.shadowRoot.appendChild(styles)

  skinOfTheMatchWrapper.shadowRoot.appendChild(skinOfTheMatchElement)
  infoColumnElement.appendChild(skinOfTheMatchWrapper)

  if (skinOfTheMatch.skin.color) {
    setTimeout(() => {
      skinOfTheMatchElement.childNodes[0].appendChild(
        <div
          className="spotlight"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(66% 66% at 50% 100%, ${skinOfTheMatch.skin.color} 0%, transparent 100%)`,
            animation: '500ms ease-out spotlightFadeIn',
            zIndex: 1,
            borderRadius: 6,
            transition: 'opacity 250ms ease-out'
          }}
        />
      )
    }, 500)
  }
}
