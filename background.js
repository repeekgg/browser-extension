const observer = new MutationObserver(() => {
  const [ready] = document.querySelectorAll('button[translate-once="ACCEPT"]')
  if (ready) {
    ready.click()
  }
})

const observerConfig = {
  childList: true
}

const targetNode = document.body

observer.observe(targetNode, observerConfig)
