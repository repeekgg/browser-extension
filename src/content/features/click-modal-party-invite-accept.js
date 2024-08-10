import select from 'select-dom'
import { isFaceitNext } from '../helpers/dom-element'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { notifyIf } from '../helpers/user-settings'

export const FEATURE_NAME = 'click-modal-party-invite-accept'

const partyInviteModalContentRegExp = new RegExp(
  [
    'Click accept to join the party',
    'انقر فوق قبول للانضمام إلى الحزب',
    'Klicke auf Akzeptieren, um beizutreten',
    'Haz clic en Aceptar para unirte al grupo',
    'Klikkaa hyväksy liittyäksesi ryhmään',
    'Cliquez pour accepter de rejoindre le groupe',
    'グループに加入するには承認をクリックしてください',
    '집단에 참가하려면 수락을 클릭하세요',
    'Кликнете на „Прифати“ да се приклучите во групата',
    'Kliknij Akceptuję, aby dołączyć do drużyny',
    'Clica em aceitar para te juntares ao grupo',
    'Clique em aceitar para participar do grupo',
    'Нажмите "Принять", чтобы присоединиться к группе',
    'Klicka acceptera för att gå med i laget',
    '点击接受加入派对',
    "Gruba katılmak için kabul et'e tıkla",
    'Klik terima untuk gabung ke kelompok',
    'คลิกยอมรับเพื่อเข้าร่วมปาร์ตี้',
    'Klikni „Prihvati” za pridruživanje grupi',
  ].join('|'),
)

export default async ({
  baseElement = document,
  isFaceitBeta = isFaceitNext(),
} = {}) => {
  const modalElements = select.all(
    isFaceitBeta
      ? '.ReactModalPortal:has(div[class*="modal-next__Container"])'
      : '.ReactModalPortal',
    baseElement,
  )

  let partyInviteModalElement

  for (const modalElement of modalElements) {
    if (partyInviteModalContentRegExp.test(modalElement.innerHTML)) {
      partyInviteModalElement = modalElement

      break
    }
  }

  if (
    !partyInviteModalElement ||
    hasFeatureAttribute(FEATURE_NAME, partyInviteModalElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_NAME, partyInviteModalElement)

  const acceptButtonElement = select.all('button', partyInviteModalElement)[2]

  if (!acceptButtonElement) {
    return
  }

  acceptButtonElement.click()

  notifyIf('notifyPartyAutoAcceptInvite', {
    title: 'Party Invite Accepted',
    message: 'A party invite has been accepted.',
  })
}
