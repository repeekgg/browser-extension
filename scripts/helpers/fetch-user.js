const got = require('got')

module.exports = async nickname => {
  const response = await got(
    `https://api.faceit.com/core/v1/nicknames/${nickname}`,
    { json: true }
  )
  return response.body.payload
}
