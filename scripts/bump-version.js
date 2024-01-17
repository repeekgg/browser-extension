const path = require('path')
const loadJsonFile = require('load-json-file')
const writeJsonFile = require('write-json-file')
const semver = require('semver')
const execa = require('execa')
;(async () => {
  try {
    const releaseType = process.argv[2]

    const manifestFile = path.resolve(__dirname, '..', 'src', 'manifest.json')

    const manifest = await loadJsonFile(manifestFile)
    manifest.version = semver.inc(manifest.version, releaseType)

    await writeJsonFile(manifestFile, manifest, { detectIndent: true })

    // biome-ignore lint/suspicious/noConsoleLog:
    console.log(`Bumped to version ${manifest.version}`)

    const gitCommitProc = execa('git', ['commit', '-am', manifest.version])
    gitCommitProc.stdout.pipe(process.stdout)
    await gitCommitProc

    const gitTagProc = execa('git', ['tag', `v${manifest.version}`])
    gitTagProc.stdout.pipe(process.stdout)
    await gitTagProc
  } catch (error) {
    // biome-ignore lint/suspicious/noConsoleLog:
    console.log(error)
  }
})()
