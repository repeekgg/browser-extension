/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'

import { deleteUser, getPlayer } from '../helpers/faceit-api'
import { getPlayerProfileNickname } from '../helpers/player-profile'

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

  friendList.forEach(friends => {
    const friend = select('a', friends)

    const playerRequest = getPlayer(friend.innerText)
    playerRequest.then(player => {
      const isAlreadyDeletable = select('span.fast-delete', friends)
      if (isAlreadyDeletable) {
        return
      }

      friends.children[0].append(
        <span
          style={{
            margin: '1em',
            cursor: 'pointer'
          }}
          className="fast-delete"
          onClick={() => deleteUser(guid, player.guid)}
          aria="Delete"
        >
          x
        </span>
      )
    })
  })
}
