/* eslint-disable import/newline-after-import,unicorn/no-process-exit */
const execa = require('execa')

;(async () => {
  try {
    const gitPushMainProc = execa('git', ['push', 'origin', 'Main'])
    gitPushMainProc.stdout.pipe(process.stdout)
    await gitPushMainProc

    const version = (
      await execa.stdout('git', ['log', '-1', '--pretty=%B'])
    ).trim()

    const gitPushTagProc = execa('git', ['push', 'origin', `v${version}`])
    gitPushTagProc.stdout.pipe(process.stdout)
    await gitPushTagProc
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
})()
