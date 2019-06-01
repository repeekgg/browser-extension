/* eslint-disable import/newline-after-import,unicorn/no-process-exit */
const path = require('path')
const loadJsonFile = require('load-json-file')
const writeJsonFile = require('write-json-file')
const formatDate = require('date-fns/format')
const fetchUser = require('./helpers/fetch-user')

;(async () => {
  try {
    const nickname = process.argv[2]
    const months = process.argv[3]

    if (!months) {
      console.error('<months> is required: <nickname> <months>')
      process.exit(1)
    }

    const file = path.resolve(
      __dirname,
      '..',
      'src',
      'content',
      'bans',
      'bans.json'
    )
    const users = await loadJsonFile(file)

    if (users.some(user => user.nickname === nickname)) {
      console.error(`${nickname} already exists`)
      process.exit(1)
    }

    const { guid } = await fetchUser(nickname)

    await writeJsonFile(
      file,
      [
        ...users,
        {
          nickname,
          guid,
          startDate: formatDate(Date.now(), 'YYYY-MM-DD'),
          months: Number(months)
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
