module.exports = type => {
  let string = ''

  for (let i = 0; i < 7; i++) {
    if (i === 3) {
      string += '-'
    } else {
      string += type ? `${~~(Math.random() * 10)}` : `${String.fromCharCode(~~(Math.random() * (26) + 97))}`
    }
  }

  return string
}
