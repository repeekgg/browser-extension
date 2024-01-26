import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import chokidar from 'chokidar'
// @ts-expect-error: Doesn't come with TS definitions and `@types/dot-json` isn't available
import DotJson from 'dot-json'
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

  if (distPath.endsWith('manifest.json')) {
    const manifestJson = new DotJson(distPath)

    if (IS_FIREFOX) {
      manifestJson
        // Firefox doesn't support `background.service_worker`, but `background.scripts`:
        // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background#browser_support
        // TODO: Remove/change this once browsers have come to a common solution
        .set('background.scripts', [
          manifestJson.get('background.service_worker'),
        ])
        .delete('background.service_worker')
        // Remove keys not supported by Firefox
        .delete('minimum_chrome_version')
        // Firefox only supports `optional_permissions` instead of `optional_host_permissions`:
        // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/optional_permissions#host_permissions
        // TODO: Remove once `optional_host_permissions` is supported
        .set(
          'optional_permissions',
          manifestJson.get('optional_host_permissions'),
        )
        .delete('optional_host_permissions')
    } else {
      // Remove keys not supported by Chrome
      manifestJson.delete('browser_specific_settings')
    }

    manifestJson.save()
  }

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
        extend: {
          fontFamily: {
            sans: [
              '"Inter", sans-serif',
              { fontFeatureSettings: '"liga" 1, "calt" 1' },
            ],
          },
        },
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
    entryPointSuffix = '.js',
    ...additionalEsbuildOptions
  }: {
    tailwind?: boolean
    tailwindInline?: boolean
    entryPointSuffix?: '.js' | '.ts' | '.tsx'
  } & esbuild.BuildOptions = {},
) {
  const esbuildOptions: esbuild.BuildOptions & { plugins: esbuild.Plugin[] } = {
    entryPoints: [getSrcPath(context, `index${entryPointSuffix}`)],
    outfile: getDistPath(`${context}.js`),
    bundle: true,
    minify: !IS_DEV,
    metafile: true,
    plugins: [],
    target: TARGET_BROWSER.replace(' ', ''),
    loader:
      entryPointSuffix === '.js'
        ? {
            '.js': 'jsx',
          }
        : undefined,
    tsconfig: entryPointSuffix === '.js' ? 'tsconfig.legacy.json' : undefined,
    ...additionalEsbuildOptions,
  }

  if (tailwind) {
    esbuildOptions.plugins.push(
      esbuildStyle({
        postcss: {
          plugins: getPostcssPlugins([
            getSrcPath(`${context}/**/*.{js,ts,tsx}`),
          ]),
        },
      }),
    )
  }

  if (tailwindInline) {
    esbuildOptions.plugins.push(
      esbuildInline({
        filter: /^tailwindInline:/,
        transform: (content) =>
          postcss(
            getPostcssPlugins([getSrcPath(`${context}/**/*.{js,ts,tsx}`)]),
          )
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
    // biome-ignore lint/suspicious/noConsoleLog:
    console.log('[info] building for', IS_FIREFOX ? 'firefox' : 'chrome')

    await rm(getDistPath(), { recursive: true, force: true })

    await mkdir(getDistPath())

    await Promise.all([
      copyFiles(
        'icon16.png',
        'icon48.png',
        'icon128.png',
        'manifest.json',
        'popup.html',
        'options.html',
        'fonts.css',
      ),
      bundleContext('background'),
      bundleContext('content', {
        tailwindInline: true,
      }),
      bundleContext('popup', { define: { global: 'window' } }),
      bundleContext('options', { entryPointSuffix: '.tsx', tailwind: true }),
    ])
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

build()
