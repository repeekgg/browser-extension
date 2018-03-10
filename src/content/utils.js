export const select = document.querySelector.bind(document)

export const selectAll = document.querySelectorAll.bind(document)

export const getCurrentPath = () => window.location.pathname

export const getFromPath = regExp => getCurrentPath().match(regExp)

export const matchesPath = (regExp, cb) => {
  const match = getFromPath(regExp)

  if (match) {
    cb(match[1])
  }
}

export const checkIfEnhanced = element => {
  if (element.hasAttribute('faceit-enhancer')) {
    return true
  }

  element.setAttribute('faceit-enhancer', 'true')
  return false
}
