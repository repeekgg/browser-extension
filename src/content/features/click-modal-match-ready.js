import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { notifyIf } from '../helpers/user-settings'

export const FEATURE_NAME = 'click-modal-match-ready'

const matchCheckInModalTitleRegExp = new RegExp(
  [
    'Match ready',
    '\uacbd\uae30 \uc900\ube44',
    'Rozgrywka gotowa',
    '\u041c\u0430\u0442\u0447 \u0433\u043e\u0442\u043e\u0432',
    'Partida lista',
    'Jogo preparado',
    'Partida pronta',
    'Match-Warteschlange',
    'Match pr\xeat',
    'Ottelu valmis',
    'Match redo',
    '\u6bd4\u8d5b\u5df2\u5c31\u7eea',
    'Ma\xe7 haz\u0131r',
    'Perlawanan sedia',
    '\u0e01\u0e32\u0e23\u0e41\u0e02\u0e48\u0e07\u0e02\u0e31\u0e19\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e41\u0e25\u0e49\u0e27',
    '\u8a66\u5408\u3092\u884c\u3048\u307e\u3059',
    '\u0627\u0644\u0645\u0628\u0627\u0631\u0627\u0629 \u062c\u0627\u0647\u0632\u0629',
    'Me\u010d je spreman',
    '\u041d\u0430\u0442\u043f\u0440\u0435\u0432\u0430\u0440\u043e\u0442 \u0435 \u043f\u043e\u0434\u0433\u043e\u0442\u0432\u0435\u043d',
  ].join('|'),
)

export default async ({ baseElement = document } = {}) => {
  let matchCheckInModalElement

  const modalElements = select.all('.FuseModalPortal:has(h5)', baseElement)

  for (const modalElement of modalElements) {
    if (matchCheckInModalTitleRegExp.test(modalElement.innerHTML)) {
      matchCheckInModalElement = modalElement

      break
    }
  }

  if (
    !matchCheckInModalElement ||
    hasFeatureAttribute(FEATURE_NAME, matchCheckInModalElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_NAME, matchCheckInModalElement)

  const acceptButton = select('button', matchCheckInModalElement)

  if (acceptButton) {
    acceptButton.click()

    notifyIf('notifyPartyAutoAcceptInvite', {
      title: 'Match Readied Up',
      message: 'A match has been readied up.',
    })
  }
}
