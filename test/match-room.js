import test from 'ava'
import * as matchRoom from '../src/content/libs/match-room'

test('getRoomId', t => {
  const roomId = '466ece1d-9f16-4b64-aa2d-826c60bc022f'
  const path = `en/csgo/room/${roomId}`

  t.is(matchRoom.getRoomId(path), roomId)
  t.falsy(matchRoom.getRoomId(''))
})

test('mapPlayersToPartyColors', t => {
  const createPlayer = (nickname, activeTeamId) => ({
    nickname,
    activeTeamId
  })
  const faction = [
    createPlayer('a', '1'),
    createPlayer('b', '1'),
    createPlayer('c', '2')
  ]
  const colors = ['white', 'black']

  t.deepEqual(matchRoom.mapPlayersToPartyColors(faction, true, colors), {
    a: colors[0],
    b: colors[0],
    c: colors[1]
  })
})
