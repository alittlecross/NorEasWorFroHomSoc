const highlightScores = _ => {
  const names = $('#points-table .names span')
  names.removeClass(['highlight-pink', 'highlight-yellow'])
  
  const points = $('#points td').map((_, e) => $(e).text()).toArray()
  const distinct = [...new Set(points)].sort((a, b) => a - b)

  if (distinct.length > 1) {
    const _h = distinct.pop()

    const _0 = points.filter(point => distinct[0] === point).length
    const _1 = points.filter(point => distinct[1] === point).length
    const _2 = points.filter(point => distinct[2] === point).length

    const secondLast = _0 > 2 || _0 + _1 > 4
    const thirdLast = _0 + _1 > 2 || _0 + _1 + _2 > 4

    points.forEach((p, i) => {
      const highScore = _h === p
      const lowScore = distinct[0] === p || (secondLast ? false : distinct[1] === p) || (thirdLast ? false : distinct[2] === p)

      if (highScore) {
        $(names[i]).addClass('highlight-yellow')
      }

      if (lowScore) {
        $(names[i]).addClass('highlight-pink')
      }
    })
  }
}

const updateCookie = _ => {
  const id = document.cookie.split('=')[1]
  
  document.cookie = `id=${id}; max-age=${60 * 60}; path=/`
}

$(document).keypress(key => {
  const keycode = key.keycode ? key.keycode : key.which
  const enterKey = keycode === 13

  const submit = $(':focus').next()
  const allowed = !submit.attr('disabled')

  if (allowed && enterKey) {
    submit.trigger('click')
  }
})

$(document).ready(_ => {
  $('#answer input').on('cut copy paste', e => {
    e.preventDefault()
  })

  $('#bonus-points').click(_ => {
    const table = $('#bonus-points-table')
    const tables = $('#menu table')
    const visible = table.is(':visible')

    tables.attr('hidden', true)

    if (!visible) {
      table.removeAttr('hidden')
    }
  })

  $('#img-container-enlarged').click(_ => {
    hideEnlargedImage()
  })

  $('#merge-players').click(_ => {
    const table = $('#merge-players-table')
    const tables = $('#menu table')
    const visible = table.is(':visible')

    tables.attr('hidden', true)

    if (!visible) {
      table.removeAttr('hidden')
    }
  })

  $('#remove-player').click(_ => {
    const table = $('#remove-player-table')
    const tables = $('#menu table')
    const visible = table.is(':visible')

    tables.attr('hidden', true)

    if (!visible) {
      table.removeAttr('hidden')
    }
  })

  $('#switch-host').click(_ => {
    const table = $('#switch-host-table')
    const tables = $('#menu table')
    const visible = table.is(':visible')

    tables.attr('hidden', true)

    if (!visible) {
      table.removeAttr('hidden')
    }
  })

  $('#questions').on('click', '.img-card', function () {
    const url = $('img', this).attr('src')

    $('#img-container-enlarged img').attr('src', url)
    $('#img-container-enlarged').removeAttr('hidden')
  })

  highlightScores()
  updateCookie()
})

const hideEnlargedImage = _ => {
  $('#img-container-enlarged').attr('hidden', true)
  $('#img-container-enlarged img').attr('src', '')
}

const updateElementVisibility = _game => {
  const counting = _game.counting
  const host = _game.host.id
  const id = document.cookie.split('=')[1]
  const youAreHost = host === id

  $('#game').data('counting', counting)
  $('#host').text(_game.host.name)

  if (!counting && youAreHost) {
    $('#ask-next-question').removeAttr('hidden')
  } else {
    $('#ask-next-question').attr('hidden', true)
  }

  if (counting && youAreHost) {
    $('#end-countdown').removeAttr('hidden')
  } else {
    $('#end-countdown').attr('hidden', true)
  }

  if (counting && !youAreHost) {
    $('#answer').removeAttr('hidden')
  } else {
    $('#answer').attr('hidden', true)
  }

  if (!counting) {
    $('#points-table').removeAttr('hidden')
  } else {
    $('#points-table').attr('hidden', true)
  }

  $('#bonus-points-table').attr('hidden', true)
  $('#merge-players-table').attr('hidden', true)
  $('#remove-player-table').attr('hidden', true)
  $('#switch-host-table').attr('hidden', true)

  if (!counting && youAreHost) {
    $('#menu').removeAttr('hidden')
  } else {
    $('#menu').attr('hidden', true)
  }

  if (counting) {
    $('#countdown').text(_game.seconds)
  } else {
    $('#countdown').text('')
  }
}

const updateMenuTables = _game => {
  $('#bonus-points-table').html(_ => {
    let html = '<tr>'

    for (const id in _game.players) {
      if (_game.players[id].visible) {
        html += `<td data-id="${id}"><span class="sign">-</span> &nbsp; &nbsp; <span class="sign">+</span></td>`
      }
    }

    html += '</tr>'

    return html
  })

  $('#merge-players-table').html(_ => {
    let html = '<tr>'

    for (const id in _game.players) {
      if (_game.players[id].visible) {
        html += `<td data-id="${id}"><span class="sign">#</span></td>`
      }
    }

    html += '</tr>'

    return html
  })

  $('#remove-player-table').html(_ => {
    let html = '<tr>'

    for (const id in _game.players) {
      if (_game.players[id].visible) {
        html += `<td data-id="${id}"><span class="sign">&cross;</span></td>`
      }
    }

    html += '</tr>'

    return html
  })

  $('#switch-host-table').html(_ => {
    let html = '<tr>'

    for (const id in _game.players) {
      if (_game.players[id].visible) {
        html += `<td data-id="${id}"><span class="sign">&check;</span></td>`
      }
    }

    html += '</tr>'

    return html
  })
}

const updatePointsTable = _game => {
  $('#points-table').html(_ => {
    let html = '<tr class="names">'

    for (const id in _game.players) {
      if (_game.players[id].visible) {
        html += `<td data-id="${id}"><span>${_game.players[id].name}</span></td>`
      }
    }

    html += '</tr><tr id="points">'

    for (const id in _game.players) {
      if (_game.players[id].visible) {
        html += `<td data-id="${id}">${_game.players[id].points}</td>`
      }
    }

    html += '</tr>'

    return html
  })

  highlightScores()
}

const updateQuestions = _game => {
  $('#questions').html(_ => {
    const _id = document.cookie.split('=')[1]

    let html = ''

    _game.questions.forEach((_, index, a) => {
      const i = a.length - index - 1

      html += `<div id="${i}"><div class="question">${i + 1}. ${a[i].question}`

      if (a[i].showAnswer) {
        html += ` <span class="highlight-yellow">${a[i].answer}</span>`
      }

      html += '</div>'

      if (a[i].picture) {
        html += '<div class="img-container"><div class="img-card"><div>'
        html += `<img src="${a[i].picture}" alt="Cannot find a picture at that url &nbsp;">`
        html += '</div></div></div>'
      }

      html += '<table><tr class="names">'

      for (const id in _game.players) {
        if (_game.players[id].visible) {
          html += `<td data-id="${id}">${_game.players[id].name}</td>`
        }
      }

      html += '</tr><tr class="answers">'

      for (const id in _game.players) {
        if (_game.players[id].visible) {
          if (_game.players[id].answers[i]) {
            if (_game.players[id].answers[i].visible) {
              html += '<td'

              if (_game.host.id === _id) {
                html += ' class="answer"'
              }

              html += ` data-id="${id}"><span`

              if (_game.players[id].answers[i].correct) {
                html += ' class="highlight-green"'
              }

              html += `>${_game.players[id].answers[i].answer}</span></td>`
            } else {
              html += `<td class="highlight-blue" data-id="${id}"><span>`

              if (_id === id || _game.host.id === _id) {
                html += `${_game.players[id].answers[i].answer}`
              }

              html += '</span></td>'
            }
          } else {
            html += `<td data-id="${id}"><span></span></td>`
          }
        }
      }

      html += '</tr></table></div>'
    })

    html += '</div>'

    return html
  })
}
