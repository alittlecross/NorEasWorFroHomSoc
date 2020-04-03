const Answer = require('../lib/answer')

module.exports = (gamecode, game, io) => {
  const i = game.questions.length - 1
  const seconds = game.seconds

  const countdown = setInterval(_ => {
    if (game.seconds) {
      io.of(gamecode).emit('update countdown', game.seconds--)
    } else {
      clearInterval(countdown)

      game.counting = false
      game.questions[i].showAnswer = true
      game.seconds = seconds

      for (const id in game.players) {
        if (game.players[id].answers.length <= i) {
          game.players[id].answers[i] = new Answer('-', false)
        } else {
          game.players[id].answers[i].visible = true
        }
      }

      io.of(gamecode).emit('reveal answers', game)
    }
  }, 1000)
}
