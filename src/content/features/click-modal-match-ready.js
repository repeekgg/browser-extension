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
    '경기 준비',
    'Rozgrywka gotowa',
    'Матч готов',
    'Partida lista',
    'Jogo preparado',
    'Partida pronta',
    'Match bereit',
    'Match prêt',
    'Ottelu valmis',
    'Match redo',
    '比赛已就绪',
    'Maç hazır',
    'Perlawanan sedia',
    'การแข่งขันพร้อมแล้ว',
    '試合を行えます',
    'المباراة جاهزة',
    'Meč je spreman',
    'Натпреварот е подготвен',
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
