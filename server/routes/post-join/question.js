const Question = require('../../lib/question')

const countdown = require('../../services/countdown')

module.exports = {
  get: (req, res) => {
    const gamecode = req.params.gamecode
    const games = req.app.get('games')

    const game = games[gamecode]

    if (!game) {
      res.redirect('/')
    } else {
      const cookie = req.cookies.id
      const host = game.host.id
      const youAreHost = cookie === host
      const youArePlayer = game.players[cookie]

      if (!youArePlayer) {
        res.redirect('/')
      } else {
        const counting = game.counting

        if (!counting && youAreHost) {
          const flash = res.locals.flash

          res.render('post-join/question.ejs', {
            _answer: flash ? flash.answer : '',
            _game: game,
            _gamecode: gamecode,
            _messages: flash ? flash.messages : 0,
            _picture: flash ? flash.picture : '',
            _question: flash ? flash.question : '',
            _seconds: flash ? flash.seconds : game.seconds
          })
        } else {
          res.redirect(`/${gamecode}/game`)
        }
      }
    }
  },

  post: (req, res) => {
    const gamecode = req.params.gamecode
    const games = req.app.get('games')

    const game = games[gamecode]

    if (!game) {
      res.redirect('/')
    } else {
      const cookie = req.cookies.id
      const host = game.host.id
      const youAreHost = cookie === host
      const youArePlayer = game.players[cookie]

      if (!youArePlayer) {
        res.redirect('/')
      } else {
        const counting = game.counting

        if (!counting && youAreHost) {
          const answer = req.body.answer
          const messages = []
          const picture = req.body.picture
          const question = req.body.question
          const seconds = req.body.seconds

          if (!answer || !question || !seconds) messages.push('All fields above are required')
          if (seconds && !/^([0-5]?[0-9]|60)$/.test(seconds)) messages.push('The seconds field accepts numbers from 0 to 60')

          if (messages.length) {
            req.session.flash = {
              answer: answer,
              messages: messages,
              picture: picture,
              question: question,
              seconds: seconds
            }

            res.redirect(`/${gamecode}/question`)
          } else {
            game.counting = true
            game.questions.push(new Question(
              req.body.answer,
              req.body.picture,
              req.body.question,
              false
            ))
            game.seconds = +req.body.seconds

            const io = req.app.get('io')

            io.of(gamecode).emit('new question', game)

            countdown(gamecode, game, io)

            res.redirect(`/${gamecode}/game`)
          }
        } else {
          res.redirect(`/${gamecode}/game`)
        }
      }
    }
  }
}
