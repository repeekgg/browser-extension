import React from 'dom-chef'
import { twMerge } from 'tailwind-merge'
import storage from '../../shared/storage'
import styles from 'tailwindInline:../styles.css'

function createNotification({
  title,
  description,
  link,
  linkLabel = 'Find out more',
  onClose,
}) {
  const rootElement = document.createElement('div')
  rootElement.attachShadow({ mode: 'open' })

  const styleElement = document.createElement('style')
  styleElement.textContent = styles

  rootElement.shadowRoot.appendChild(styleElement)

  const buttonLinkClassNames =
    'inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 outline-none border border-transparent transition text-center cursor-pointer text-neutral-900 bg-white hover:text-white hover:bg-neutral-950 hover:border-neutral-600 flex-1'

  rootElement.shadowRoot.appendChild(
    <div className="fixed bottom-4 right-4 z-[999999] rounded-md border border-neutral-700 bg-gradient-to-tl from-neutral-950 from-50% to-neutral-900 p-4 text-sm text-white shadow-neutral-950/75 transition shadow-lg w-80">
      <div className="flex justify-between items-center mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 88 24"
          className="h-4"
        >
          <title>Repeek</title>
          <path
            fill="currentColor"
            d="M31.333 14.14 33.492 18h3.333l-2.51-4.527a4.036 4.036 0 0 0 1.827-3.403A4.046 4.046 0 0 0 32.088 6H27v12h2.93v-3.86h1.403Zm-1.403-2.773V8.77h2.158c.736 0 1.3.564 1.3 1.3 0 .702-.598 1.297-1.3 1.297H29.93Zm10.668 3.879v-2.002h4.176V10.49h-4.176V8.77h4.596V6h-7.526v12h7.614v-2.754h-4.684ZM51.51 6h-4.577v12h2.91v-3.86h1.667a4.076 4.076 0 0 0 4.089-4.07A4.076 4.076 0 0 0 51.51 6Zm-1.666 5.367V8.77h1.666c.755 0 1.3.545 1.3 1.3 0 .736-.56 1.297-1.3 1.297h-1.666Zm9.81 3.879v-2.002h4.175V10.49h-4.176V8.77h4.596V6h-7.525v12h7.613v-2.754h-4.684Zm9.245 0v-2.002h4.176V10.49H68.9V8.77h4.596V6H65.97v12h7.614v-2.754H68.9ZM82.443 18h3.632l-4.963-6.545L85.498 6h-3.684l-3.67 4.509V6h-2.929v12h2.93v-2.826l1.087-1.366L82.444 18ZM7.762 12.993l.824 1.89.322-2.9-3.36-1.75v1.772l2.214.988Z"
          />
          <path
            fill="currentColor"
            d="M14.264 6.023 10.16 4.975l-4.114 1.02L1 1l.932 19.699 3.459-2.477 4.09 4.773-2.661-8.593-2.35 1.876-1.078-9.96L5.1 8.587l5.05-1.041L15.19 8.62l1.73-2.302-1.152 9.998-2.337-1.892L10.713 23l4.123-4.746 3.441 2.5 1.066-19.692-5.079 4.96Z"
          />
          <path
            fill="currentColor"
            d="M14.72 12.006v-1.772l-3.36 1.749.322 2.9.824-1.89 2.215-.987Z"
          />
        </svg>
        <div
          className="text-neutral-400 hover:text-white cursor-pointer text-xs transition"
          onClick={() => {
            rootElement.remove()
            onClose()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="w-4 h-4"
          >
            <title>Close</title>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </div>
      </div>
      <div className="mb-2">
        <div className="font-bold">{title}</div>
        <div
          className="text-neutral-400"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
      <div className="flex gap-2 text-xs">
        <a
          className={buttonLinkClassNames}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkLabel}{' '}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="w-3 h-3"
          >
            <title>External link</title>
            <path d="M15 3h6v6" />
            <path d="M10 14 21 3" />
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
        </a>
        <a
          className={twMerge(
            buttonLinkClassNames,
            'text-white bg-black border-neutral-600 hover:bg-white hover:text-black hover:border-transparent',
          )}
          href="https://twitter.com/repeekgg"
          title="Repeek on Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow on{' '}
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="h-3"
          >
            <title>X</title>
            <path
              fill="currentColor"
              d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
            />
          </svg>
        </a>
      </div>
    </div>,
  )

  document.body.appendChild(rootElement)
}

export default async () => {
  const { repeekNotificationClosed, faceitBetaNotificationClosed } =
    await storage.getAll()

  const createFaceitBetaNotification = () => {
    if (!faceitBetaNotificationClosed) {
      createNotification({
        title: 'FACEIT Beta support now available',
        description:
          'You can now use Repeek on the new FACEIT Beta platform. Simply enable it in the Repeek settings under <b>General</b> or read our guide to find out more.',
        link: 'https://repeek.gg/blog/faceit-beta-support-now-available?utm_source=faceit&utm_medium=repeek&utm_campaign=faceit-beta-support-now-available',
        onClose: () => {
          storage.set({ faceitBetaNotificationClosed: true })
        },
      })
    }
  }

  if (!repeekNotificationClosed) {
    createNotification({
      title: 'FACEIT Enhancer is now Repeek',
      description:
        "Don't worry, nothing really changes for you, right away. Repeek is setting the foundation to be better and faster than ever before.",
      linkLabel: 'Read more',
      link: 'https://repeek.gg/blog/faceit-enhancer-is-now-repeek?utm_source=faceit&utm_medium=repeek&utm_campaign=faceit-enhancer-is-now-repeek',
      onClose: () => {
        storage.set({ repeekNotificationClosed: true })

        createFaceitBetaNotification()
      },
    })

    return
  }

  createFaceitBetaNotification()
}
