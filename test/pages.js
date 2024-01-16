import test from 'ava'
import * as pages from '../src/content/helpers/pages'

test('isRoomOverview', (t) => {
  const path = 'en/csgo/room/466ece1d-9f16-4b64-aa2d-826c60bc022f'

  t.true(pages.isRoomOverview(path))
  t.false(pages.isRoomOverview(''))
})
