import chrome from 'sinon-chrome'

// @ts-expect-error
global.location = new URL('https://www.faceit.com')

// @ts-expect-error
global.chrome = chrome

global.chrome.runtime.id = 'testid'
