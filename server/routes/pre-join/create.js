const Game = require('../../lib/game')
const generator = require('../../utils/generator')

module.exports = {
  get: (_, res) => {
    const flash = res.locals.flash

    res.render('pre-join/create.ejs', {
      _message: flash ? flash.message : ''
    })
  },

  post: (req, res) => {
    const name = req.body.name

    if (!name) {
      req.session.flash = {
        message: 'This field is required'
      }

      res.redirect('/create')
    } else {
      const games = req.app.get('games')

      let gamecode

      do {
        gamecode = generator(1)
      }
      while (games[gamecode])

      const password = generator(0)

      games[gamecode] = new Game(name, password)

      console.log(Object.keys(games))

      const game = games[gamecode]
      const io = req.app.get('io')

      if (!Object.prototype.hasOwnProperty.call(io.nsps, `/${gamecode}`)) {
        const namespace = io.of(gamecode)

        namespace.on('connection', socket => require('../../services/socket-server')(game, namespace, socket))
      }

      res.redirect(`/join/${gamecode}/${password}`)
    }
  }
}
