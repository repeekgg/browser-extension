export const select = document.querySelector.bind(document)

export const selectAll = document.querySelectorAll.bind(document)

export const checkIfEnhanced = element => {
  if (element.hasAttribute('faceit-enhancer')) {
    return true
  }

  element.setAttribute('faceit-enhancer', 'true')
  return false
}
