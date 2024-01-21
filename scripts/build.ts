import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import chokidar from 'chokidar'
import * as esbuild from 'esbuild'
import esbuildInline from 'esbuild-plugin-inline-import'
import esbuildStyle from 'esbuild-style-plugin'
import postcss from 'postcss'
import tailwind from 'tailwindcss'

const IS_FIREFOX = process.argv.includes('--firefox')
const IS_DEV = process.argv.includes('--dev')

const TARGET_BROWSER = IS_FIREFOX ? 'firefox 114' : 'chrome 105'

function getSrcPath(...srcPath: string[]) {
  return path.join('./src', ...srcPath)
}

function getDistPath(...distPath: string[]) {
  return path.join('./dist', ...distPath)
}

async function copyFile(srcFile: string) {
  const srcPath = srcFile.startsWith('src') ? srcFile : getSrcPath(srcFile)
  const distPath = getDistPath(srcPath.replace('src', ''))

  await cp(srcPath, distPath, { recursive: true })

  // biome-ignore lint/suspicious/noConsoleLog:
  console.log('[info] copied', srcPath.replace('src/', ''))
}

async function copyFiles(...srcFiles: string[]) {
  await Promise.all(srcFiles.map(copyFile))

  if (IS_DEV) {
    chokidar.watch(getSrcPath(`{${srcFiles.join(',')}}`)).on('change', copyFile)
  }
}

function getPostcssPlugins(tailwindContent: string[]) {
  return <postcss.AcceptedPlugin[]>[
    tailwind({
      content: [...tailwindContent],
      theme: {
        extend: {},
      },
      plugins: [],
    }),
    autoprefixer({
      overrideBrowserslist: TARGET_BROWSER,
    }),
  ]
}

async function bundleContext(
  context: string,
  {
    tailwind,
    tailwindInline,
    ...additionalEsbuildOptions
  }: {
    tailwind?: boolean
    tailwindInline?: boolean
  } & esbuild.BuildOptions = {},
) {
  const esbuildOptions: esbuild.BuildOptions & { plugins: esbuild.Plugin[] } = {
    entryPoints: [getSrcPath(context, 'index.js')],
    outfile: getDistPath(`${context}.js`),
    bundle: true,
    minify: !IS_DEV,
    metafile: true,
    plugins: [],
    target: TARGET_BROWSER.replace(' ', ''),
    loader: {
      '.js': 'jsx',
    },
    ...additionalEsbuildOptions,
  }

  if (tailwind) {
    esbuildOptions.plugins.push(
      esbuildStyle({
        postcss: {
          plugins: getPostcssPlugins([getSrcPath(`${context}/**/*.js`)]),
        },
      }),
    )
  }

  if (tailwindInline) {
    esbuildOptions.plugins.push(
      esbuildInline({
        filter: /^tailwindInline:/,
        transform: (content) =>
          postcss(getPostcssPlugins([getSrcPath(`${context}/**/*.js`)]))
            .process(content, { from: undefined })
            .then((result) => result.css)
            .catch((error) => {
              console.error(error.message)
              return ''
            }),
      }),
    )
  }

  esbuildOptions.plugins.push({
    name: 'log',
    setup: (build) => {
      build.onEnd((result) => {
        if (result.metafile?.outputs) {
          for (const outputFile of Object.keys(result.metafile.outputs)) {
            // biome-ignore lint/suspicious/noConsoleLog:
            console.log('[info] compiled', outputFile.replace('dist/', ''))
          }
        }
      })
    },
  })

  if (IS_DEV) {
    const esbuildContext = await esbuild.context(esbuildOptions)

    await esbuildContext.watch()

    return
  }

  esbuild.build(esbuildOptions)
}

async function build() {
  try {
    await rm(getDistPath(), { recursive: true, force: true })

    await mkdir(getDistPath())

    await Promise.all([
      copyFiles(
        'icon16.png',
        'icon48.png',
        'icon128.png',
        'manifest.json',
        'popup.html',
      ),
      bundleContext('background'),
      bundleContext('content', {
        tailwindInline: true,
      }),
      bundleContext('popup', { define: { global: 'window' } }),
    ])
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

build()
