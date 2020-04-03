(_ => {
  const gamecode = $('#game').data('gamecode')
  const socket = io(`/${gamecode}`)

  $('#answer button').click(_ => {
    const answer = $('#answer input').val()
    const counting = $('#game').data('counting')

    if (answer && counting) {
      const id = document.cookie.split('=')[1]

      updateCookie()

      $('#answer input').val('')

      socket.emit('add answer', answer, id)
    }
  })

  $('#bonus-points-table').on('click', '.sign', function () {
    const id = $(this).parent().data('id')
    const points = parseInt(`${$(this).text()}1`)

    socket.emit('add/remove bonus points', id, points)
  })

  $('#end-countdown button').click(_ => {
    socket.emit('end countdown')
  })

  $('#merge-players-table').on('click', '.sign', function () {
    const a = $('#merge').attr('data-id')
    const b = $(this).parent().attr('data-id')

    if (a) {
      if (a !== b) {
        socket.emit('merge players', a, b)
      }

      $('#merge').attr('data-id', '')
      $('#merge-players-table span').removeClass('highlight-pink')
    } else {
      $('#merge').attr('data-id', b)
      $(this).addClass('highlight-pink')
    }
  })

  $('#remove-player-table').on('click', '.sign', function () {
    const id = $(this).parent().data('id')

    socket.emit('remove player', id)
  })

  $('#switch-host-table').on('click', '.sign', function () {
    const id = $(this).parent().data('id')

    socket.emit('switch host', id)
  })

  $('#questions').on('click', '.answer', function () {
    const bool = $('span', this).hasClass('highlight-green')
    const i = $(this).closest('table').parent().attr('id')
    const id = $(this).data('id')

    socket.emit('add/remove points', !bool, i, id)
  })

  socket.on('host selected', url => {
    window.location.replace(`${url}/${gamecode}/game`)
  })

  socket.on('new question', game => {
    hideEnlargedImage()
    updateElementVisibility(game)
    updateQuestions(game)
  })

  socket.on('reveal answers', game => {
    hideEnlargedImage()
    updateElementVisibility(game)
    updateQuestions(game)
  })

  socket.on('remove player', id => {
    const _id = document.cookie.split('=')[1]

    if (_id === `${id}`) {
      window.location.replace(location.origin)
    }
  })

  socket.on('update all', game => {
    updateElementVisibility(game)
    updateMenuTables(game)
    updatePointsTable(game)
    updateQuestions(game)
  })

  socket.on('update countdown', seconds => {
    $('#countdown').text(seconds)
  })

  socket.on('update host options', players => {
    updateHostOptions(players)
  })

  socket.on('update points table', game => {
    updatePointsTable(game)
  })

  socket.on('update points table and questions', game => {
    updatePointsTable(game)
    updateQuestions(game)
  })

  socket.on('update questions', game => {
    updateQuestions(game)
  })
})()
