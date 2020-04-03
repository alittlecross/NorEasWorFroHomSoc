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
      const youArePlayer = game.players[cookie]

      if (!youArePlayer) {
        res.redirect('/')
      } else {
        if (host) {
          res.redirect(`/${gamecode}/game`)
        } else {
          const flash = res.locals.flash

          res.render('post-join/host.ejs', {
            _game: game,
            _gamecode: gamecode,
            _message: flash ? flash.message : ''
          })
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
      const youArePlayer = game.players[cookie]

      if (!youArePlayer) {
        res.redirect('/')
      } else {
        if (host) {
          res.redirect(`/${gamecode}/game`)
        } else {
          const id = req.body.id

          if (!id) {
            req.session.flash = {
              message: 'A selection is required'
            }

            res.redirect(`/${gamecode}/host`)
          } else {
            game.host.id = id
            game.host.name = game.players[id].name
            game.players[id].visible = false

            const io = req.app.get('io')

            io.of(gamecode).emit('host selected', req.headers.origin)

            res.redirect(`/${gamecode}/game`)
          }
        }
      }
    }
  }
}
