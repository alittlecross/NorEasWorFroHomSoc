const Answer = require('../../lib/answer')
const Player = require('../../lib/player')

module.exports = {
  get: (req, res) => {
    const flash = res.locals.flash

    res.render('pre-join/join.ejs', {
      _gamecode: flash ? flash.gamecode : req.params.gamecode,
      _messages: flash ? flash.messages : 0,
      _name: flash ? flash.name : '',
      _password: flash ? flash.password : req.params.password
    })
  },

  post: (req, res) => {
    const gamecode = req.body.gamecode
    const messages = []
    const name = req.body.name
    const password = req.body.password

    const games = req.app.get('games')

    const game = games[gamecode]

    if (!gamecode || !name || !password) messages.push('All fields above are required')
    if (gamecode && !/^[0-9]{3}[-][0-9]{3}$/.test(gamecode)) messages.push('The gamecode format is 123-123')
    if (password && !/^[a-z]{3}[-][a-z]{3}$/.test(password)) messages.push('The password format is abc-abc')
    if (!messages.length && (!game || game.password !== password)) messages.push('Sorry, gamecode or password incorrect')

    if (messages.length) {
      req.session.flash = {
        gamecode: gamecode,
        messages: messages,
        name: name,
        password: password
      }

      res.redirect('/join')
    } else {
      const cookie = req.cookies.id
      const host = game.host.id
      const id = cookie || Date.now()
      const name = req.body.name
      const youAreHost = cookie === host

      if (youAreHost) {
        game.host.name = name
      }

      if (game.players[id]) {
        game.players[id].name = name
      } else {
        game.players[id] = new Player(name)
      }

      const player = game.players[id]

      for (let i = player.answers.length; i < game.questions.length; i++) {
        if (game.questions[i].showAnswer) {
          player.answers.push(new Answer('-', false))
        }
      }

      res.cookie('id', id)

      const io = req.app.get('io')

      if (host) {
        io.of(gamecode).emit('update all', game)

        res.redirect(`/${gamecode}/game`)
      } else {
        io.of(gamecode).emit('update host options', game.players)

        res.redirect(`/${gamecode}/host`)
      }
    }
  }
}
