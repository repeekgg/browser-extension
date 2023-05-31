import select from 'select-dom'
import { notifyIf } from '../helpers/user-settings'

export default async () => {
  const reactModalPortalElements = select.all('.ReactModalPortal')

  reactModalPortalElements.forEach(reactModalPortalElement => {
    if (
      ![
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
        'Klikni „Prihvati” za pridruživanje grupi'
      ].some(text => reactModalPortalElement.innerHTML.indexOf(text) !== -1)
    ) {
      return
    }

    const buttonElements = select.all(
      'button:not([disabled])',
      reactModalPortalElement
    )

    for (const buttonElement of buttonElements) {
      if (
        [
          'Accept',
          'قبول',
          'Akzeptieren',
          'Aceptar',
          'Hyväksy',
          'Accepter',
          '同意する',
          '수락',
          'Прифати',
          'Zaakceptuj',
          'Aceitar',
          'Принять',
          'Godkänna',
          '接受',
          'Kabul et',
          'Menerima',
          'ยอมรับ',
          'Prihvati'
        ].includes(buttonElement.innerHTML)
      ) {
        buttonElement.click()

        notifyIf('notifyPartyAutoAcceptInvite', {
          title: 'Party Invite Accepted',
          message: 'A party invite has been accepted.'
        })
      }
    }
  })
}
