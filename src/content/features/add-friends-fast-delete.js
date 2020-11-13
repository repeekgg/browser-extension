/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'

import { deleteUser, getPlayer } from '../helpers/faceit-api'
import { getPlayerProfileNickname } from '../helpers/player-profile'

function handleDeleteUser(playerElement, userGuid, playerGuid) {
  deleteUser(userGuid, playerGuid).then(() => {
    playerElement.setAttribute('hidden', true)
  })
}

export default async parentElement => {
  const isUserProfile = select('div.page-title__edit-button', parentElement)

  if (isUserProfile === null) {
    return
  }

  const nickname = getPlayerProfileNickname()
  const { guid } = await getPlayer(nickname)

  const friendList = select.all(
    'div.profile-friends > div > section > div > div > div',
    parentElement
  )

  friendList.forEach(friendElement => {
    const friendNameElement = select('a', friendElement)

    const playerRequest = getPlayer(friendNameElement.innerText)
    playerRequest.then(player => {
      const isAlreadyDeletable = select('span.fast-delete', friendElement)
      if (isAlreadyDeletable) {
        return
      }

      friendElement.children[0].append(
        <span
          style={{
            margin: '1em',
            cursor: 'pointer'
          }}
          className="fast-delete"
          onClick={() => handleDeleteUser(friendElement, guid, player.guid)}
          aria-label="Delete"
        >
          x
        </span>
      )
    })
  })
}
