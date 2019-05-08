/* eslint-disable import/newline-after-import */
const path = require('path')
const loadJsonFile = require('load-json-file')
const writeJsonFile = require('write-json-file')
const semver = require('semver')

;(async () => {
  try {
    const releaseType = process.argv[2]
    const changelogUrl = process.argv[3]

    const manifestFile = path.resolve(__dirname, '..', 'src', 'manifest.json')
    const manifest = await loadJsonFile(manifestFile)
    manifest.version = semver.inc(manifest.version, releaseType)
    await writeJsonFile(manifestFile, manifest, { detectIndent: true })
    console.log(`Bumped to version ${manifest.version}`)

    if (changelogUrl) {
      const changelogsFile = path.resolve(
        __dirname,
        '..',
        'src',
        'changelogs.json'
      )
      const changelogs = await loadJsonFile(changelogsFile)
      await writeJsonFile(changelogsFile, {
        [manifest.version]: changelogUrl,
        ...changelogs
      })
      console.log(`Added changelog ${changelogUrl}`)
    }
  } catch (error) {
    console.log(error)
  }
})()
