import React from 'dom-chef'
import select from 'select-dom'
import browser from 'webextension-polyfill'
import {
  ACTION_FETCH_SKIN_OF_THE_MATCH,
  ACTION_POST_STATS_EVENT,
} from '../../shared/constants'
import storage from '../../shared/storage'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getMatch, getSelf } from '../helpers/faceit-api'
import { isSupportedGame } from '../helpers/games'
import { getRoomId } from '../helpers/match-room'
import styles from 'tailwindInline:../styles.css'

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

  if (!match || !isSupportedGame(match.game)) {
    return
  }

  const players = [
    ...match.teams.faction1.roster,
    ...match.teams.faction2.roster,
  ]

  const skinOfTheMatch = await browser.runtime.sendMessage({
    action: ACTION_FETCH_SKIN_OF_THE_MATCH,
    steamIds: players.map(({ gameId }) => gameId),
    organizerId: match.organizerId,
  })

  if (!skinOfTheMatch) {
    return
  }

  const skinNameMatch = skinOfTheMatch.skin.name.match(/(.+) \| (.+) \((.+)\)/)

  if (skinNameMatch) {
    skinOfTheMatch.skin.type = skinNameMatch[1]
    skinOfTheMatch.skin.name = skinNameMatch[2]
    skinOfTheMatch.skin.exterior = skinNameMatch[3]
  }

  const skinOfTheMatchPlayer = players.find(
    ({ gameId }) => gameId === skinOfTheMatch.steam_id,
  )

  if (!skinOfTheMatchPlayer) {
    return
  }

  const isSelfSkinOfTheMatchPlayer = skinOfTheMatchPlayer.id === self.id

  const statsEventData = {
    match_id: match.id,
    organizer_id: match.organizerId,
    skin: skinOfTheMatch.skin.skinport_url.split('/').pop(),
  }

  const skinOfTheMatchElement = (
    <a
      href={`${
        skinOfTheMatch.skin.skinport_url || 'https://skinport.com'
      }?r=repeek&utm_source=repeek&utm_medium=browser_extension`}
      target="_blank"
      rel="noreferrer noopener"
      className="block mt-8 relative rounded-md border border-neutral-700 bg-gradient-to-tl from-neutral-950 from-50% to-neutral-900 animate-in fade-in duration-500 ease-out group"
    >
      <div
        className="p-2 text-2xs relative z-10"
        onClick={() => {
          browser.runtime.sendMessage({
            action: ACTION_POST_STATS_EVENT,
            eventName: 'skin_of_the_match_clicked',
            data: statsEventData,
          })
        }}
      >
        <div className="flex justify-between mb-2">
          <div>
            <div className="mb-0.5 flex gap-1 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 88 24"
                className="h-3.5 text-white"
              >
                <title>Repeek</title>
                <path d="M31.333 14.14 33.492 18h3.333l-2.51-4.527a4.036 4.036 0 0 0 1.827-3.403A4.046 4.046 0 0 0 32.088 6H27v12h2.93v-3.86h1.403Zm-1.403-2.773V8.77h2.158c.736 0 1.3.564 1.3 1.3 0 .702-.598 1.297-1.3 1.297H29.93Zm10.668 3.879v-2.002h4.176V10.49h-4.176V8.77h4.596V6h-7.526v12h7.614v-2.754h-4.684ZM51.51 6h-4.577v12h2.91v-3.86h1.667a4.076 4.076 0 0 0 4.089-4.07A4.076 4.076 0 0 0 51.51 6Zm-1.666 5.367V8.77h1.666c.755 0 1.3.545 1.3 1.3 0 .736-.56 1.297-1.3 1.297h-1.666Zm9.81 3.879v-2.002h4.175V10.49h-4.176V8.77h4.596V6h-7.525v12h7.613v-2.754h-4.684Zm9.245 0v-2.002h4.176V10.49H68.9V8.77h4.596V6H65.97v12h7.614v-2.754H68.9ZM82.443 18h3.632l-4.963-6.545L85.498 6h-3.684l-3.67 4.509V6h-2.929v12h2.93v-2.826l1.087-1.366L82.444 18ZM7.762 12.993l.824 1.89.322-2.9-3.36-1.75v1.772l2.214.988Z" />
                <path d="M14.264 6.023 10.16 4.975l-4.114 1.02L1 1l.932 19.699 3.459-2.477 4.09 4.773-2.661-8.593-2.35 1.876-1.078-9.96L5.1 8.587l5.05-1.041L15.19 8.62l1.73-2.302-1.152 9.998-2.337-1.892L10.713 23l4.123-4.746 3.441 2.5 1.066-19.692-5.079 4.96Z" />
                <path d="M14.72 12.006v-1.772l-3.36 1.749.322 2.9.824-1.89 2.215-.987Z" />
              </svg>
            </div>
            <div className="text-white text-xs font-bold">
              Skin Of The Match
            </div>
          </div>
          <div>
            <div className="text-right mb-0.5">Powered by</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 13"
              className="h-2.5"
            >
              <title>Skinport Logo</title>
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
        <div className="flex justify-center gap-3">
          <div className="flex-1 flex justify-end items-center">
            <img
              src={`${skinOfTheMatch.skin.image}/256x128`}
              className="h-16 saturate-[1.25] brightness-[1.25] drop-shadow-[0_4px_3px_black] group-hover:animate-[2.5s_ease-in-out_skinOfTheMatchFloat_infinite]"
              alt={skinOfTheMatch.skin.name}
            />
          </div>
          <div className="flex-1 flex justify-center flex-col gap-0.5 w-40">
            <div className="flex gap-1 items-center">
              {skinOfTheMatchPlayer.avatar ? (
                <img
                  src={skinOfTheMatchPlayer.avatar}
                  className="size-2.5 rounded-full"
                  alt={skinOfTheMatchPlayer.nickname}
                />
              ) : (
                <div className="size-2.5 rounded-full bg-neutral-400" />
              )}
              <div
                style={{
                  color: isSelfSkinOfTheMatchPlayer
                    ? skinOfTheMatch.skin.color
                    : undefined,
                }}
              >
                {skinOfTheMatchPlayer.nickname}
              </div>
            </div>
            <div className="text-white text-xs font-bold">
              <div>{skinOfTheMatch.skin.type}</div>
              <div>{skinOfTheMatch.skin.name}</div>
            </div>
            <div>
              {skinOfTheMatch.skin.exterior}
              {skinOfTheMatch.skin.exterior && ' · '}
              {new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: skinOfTheMatch.skin.price.currency,
              }).format(skinOfTheMatch.skin.price.value)}
            </div>
          </div>
        </div>
        <div className="invisible absolute bottom-[calc(100%_+_0.5rem)] left-0 right-0 opacity-0 flex flex-col items-center transition group-hover:visible group-hover:opacity-100">
          <div className="rounded-md bg-neutral-950 max-w-64 p-2 text-center">
            This feature is provided by Repeek (formerly FACEIT Enhancer) and
            not affiliated with FACEIT.
          </div>
          <span className="border-8 border-transparent border-t-8 border-t-neutral-950 border-b-0" />
        </div>
      </div>
    </a>
  )

  const skinOfTheMatchWrapper = document.createElement('div')
  skinOfTheMatchWrapper.attachShadow({ mode: 'open' })

  const stylesElement = document.createElement('style')
  stylesElement.textContent = styles

  skinOfTheMatchWrapper.shadowRoot.appendChild(stylesElement)

  skinOfTheMatchWrapper.shadowRoot.appendChild(skinOfTheMatchElement)
  infoColumnElement.appendChild(skinOfTheMatchWrapper)

  if (skinOfTheMatch.skin.color) {
    setTimeout(() => {
      skinOfTheMatchElement.append(
        <div
          className="rounded-md absolute z-0 inset-0 opacity-15 animate-in fade-in duration-1000 ease-out group-hover:opacity-30"
          style={{
            background: `radial-gradient(66% 66% at 50% 100%, ${skinOfTheMatch.skin.color} 0%, transparent 100%)`,
          }}
        />,
      )
    }, 500)
  }

  browser.runtime.sendMessage({
    action: ACTION_POST_STATS_EVENT,
    eventName: 'skin_of_the_match_viewed',
    data: statsEventData,
  })
}
