/* eslint-disable import/newline-after-import,unicorn/no-process-exit */
const execa = require('execa')

;(async () => {
  try {
    const gitPushMasterProc = execa('git', ['push', 'origin', 'master'])
    gitPushMasterProc.stdout.pipe(process.stdout)
    await gitPushMasterProc

    const version = await execa.stdout('git', ['log', '-1', '--pretty=%B'])

    const gitPushTagProc = execa('git', ['push', 'origin', `v${version}`])
    gitPushTagProc.stdout.pipe(process.stdout)
    await gitPushTagProc
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
})()
