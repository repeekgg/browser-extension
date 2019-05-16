/* eslint-disable import/newline-after-import */
const path = require('path')
const loadJsonFile = require('load-json-file')
const writeJsonFile = require('write-json-file')
const fetchUser = require('./helpers/fetch-user')

;(async () => {
  try {
    const nickname = process.argv[2]

    const file = path.resolve(__dirname, '..', 'src', 'content', 'vips.json')
    const vips = await loadJsonFile(file)

    if (vips.some(vip => vip.nickname === nickname)) {
      return console.log(`${nickname} already exists`)
    }

    const { guid } = await fetchUser(nickname)

    await writeJsonFile(
      file,
      [
        ...vips,
        {
          nickname,
          guid
        }
      ],
      {
        detectIndent: true
      }
    )

    console.log(`Added ${nickname}`)
  } catch (error) {
    console.log(error)
  }
})()
