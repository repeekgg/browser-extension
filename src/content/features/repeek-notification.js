import React from 'dom-chef'
import browser from 'webextension-polyfill'
import storage from '../../shared/storage'

export default async () => {
  const { repeekNotificationClosed } = await storage.getAll()

  if (repeekNotificationClosed) {
    return
  }

  const rootElement = document.createElement('div')
  rootElement.attachShadow({ mode: 'open' })

  const linkElement = document.createElement('link')
  linkElement.setAttribute('rel', 'stylesheet')
  linkElement.setAttribute('href', browser.runtime.getURL('/content.css'))

  rootElement.shadowRoot.appendChild(linkElement)

  const buttonLinkClassNames =
    'gap-1 rounded-md px-2 py-1 outline-none border border-transparent transition text-center cursor-pointer text-neutral-900 bg-white hover:text-white hover:bg-neutral-950 hover:border-neutral-600 flex-1'

  rootElement.shadowRoot.appendChild(
    <div className="fixed bottom-2 right-2 z-[999999] rounded-md border border-neutral-700 bg-gradient-to-tl from-neutral-950 from-50% to-neutral-900 p-4 text-sm text-white  shadow-neutral-950/75 transition shadow-lg font-sans antialiased w-80">
      <div className="font-bold">FACEIT Enhancer is now Repeek</div>
      <div className="text-neutral-400">
        FACEIT Enhancer has been renamed to Repeek and got a new look and
        website!
      </div>
      <div className="flex gap-2 mt-2">
        <a
          className={buttonLinkClassNames}
          href="https://repeek.gg/blog/faceit-enhancer-becomes-repeek"
          title="Repeek blog"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more
        </a>
        <a
          className={buttonLinkClassNames}
          href="https://twitter.com/repeekgg"
          title="Repeek on Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow on Twitter
        </a>
      </div>
      <div className="mt-2">
        <span
          className="text-neutral-400 hover:text-white cursor-pointer text-xs transition"
          onClick={() => {
            storage.set({ repeekNotificationClosed: true })
            rootElement.remove()
          }}
        >
          Close and don&apos;t show again
        </span>
      </div>
    </div>
  )

  document.body.appendChild(rootElement)
}
