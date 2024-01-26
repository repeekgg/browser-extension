import { Reddit } from '@/components/icons/reddit'
import { Twitter } from '@/components/icons/twitter'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Logo } from '../../components/icons/logo'
import {
  getHasRequiredPermissions,
  requestAllPermissions,
} from '../shared/permissions'
import './index.css'

function App() {
  const [hasRequiredPermissions, setHasRequiredPermissions] = useState<
    boolean | undefined
  >()

  useEffect(() => {
    ;(async () => {
      const hasRequiredPermissionsResult = await getHasRequiredPermissions()

      setHasRequiredPermissions(hasRequiredPermissionsResult)

      if (!hasRequiredPermissionsResult) {
        document.title = `Permissions required - ${document.title}`
      }
    })()
  }, [])

  if (typeof hasRequiredPermissions !== 'boolean') {
    return
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-96 space-y-4 text-center">
        <div className="flex justify-center">
          <Logo className="text-white h-8" />
        </div>
        {hasRequiredPermissions ? (
          <p>
            Please access the Repeek settings by clicking on the Repeek icon in
            your browser extensions toolbar.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="text-xl text-white font-semibold">
                Additional permissions required
              </h1>
              <p>
                Some of the required permissions are treated as optional by your
                browser and must be granted manually. Without these permissions,
                Repeek won't work as expected.
              </p>
              <p>
                Your privacy and security are very important to us. Repeek will
                never collect any personal data.
              </p>
            </div>
            <button
              className="bg-white rounded-md text-neutral-950 h-10 px-4 py-2 flex items-center w-full items-center justify-center border border-transparent transition hover:bg-transparent hover:text-white hover:border-neutral-400"
              type="button"
              onClick={async () => {
                await requestAllPermissions()

                window.close()
              }}
            >
              Grant permissions
            </button>
            <div className="flex justify-center text-neutral-600 gap-4">
              <a
                href="https://x.com/repeekgg"
                target="_blank"
                rel="noreferrer noopener"
                className="transition hover:text-white"
              >
                <Twitter className="h-4" />
              </a>
              <a
                href="https://reddit.com/r/repeekgg"
                target="_blank"
                rel="noreferrer noopener"
                className="transition hover:text-white"
              >
                <Reddit className="h-4" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(<App />)
}
