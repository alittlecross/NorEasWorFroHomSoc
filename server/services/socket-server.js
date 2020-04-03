const Answer = require('../lib/answer')

module.exports = (game, namespace, socket) => {
  socket.on('add answer', (answer, id) => {
    const i = game.questions.length - 1

    game.players[id].answers[i] = new Answer(answer, false, !game.counting)

    namespace.emit('update questions', game)
  })

  socket.on('add/remove bonus points', (id, points) => {
    game.players[id].points += points

    namespace.emit('update points table', game)
  })

  socket.on('add/remove points', (bool, i, id) => {
    if (game.players[id].answers[i]) {
      game.players[id].answers[i].correct = bool
      game.players[id].points += bool ? 1 : -1

      namespace.emit('update points table and questions', game)
    }
  })

  socket.on('end countdown', _ => {
    game.seconds = 0
  })

  socket.on('merge players', (a, b) => {
    const players = [a, b].sort()

    game.players[players[1]].answers.forEach((answer, i) => {
      if (answer.answer === '-') {
        game.players[players[1]].answers[i].answer = game.players[players[0]].answers[i].answer
        game.players[players[1]].answers[i].correct = game.players[players[0]].answers[i].correct
      }
    })

    game.players[players[1]].points += game.players[players[0]].points

    delete game.players[players[0]]

    namespace.emit('remove player', players[0])
    namespace.emit('update all', game)
  })

  socket.on('remove player', id => {
    delete game.players[id]

    namespace.emit('remove player', id)
    namespace.emit('update all', game)
  })

  socket.on('switch host', id => {
    const host = game.host.id

    game.players[host].visible = true

    game.host.id = `${id}`
    game.host.name = game.players[id].name
    game.players[id].visible = false

    namespace.emit('update all', game)
  })
}
