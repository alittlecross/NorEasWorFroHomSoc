module.exports = (req, res) => {
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
        res.render('post-join/game.ejs', {
          _game: game,
          _gamecode: gamecode,
          _id: cookie
        })
      } else {
        res.redirect(`/${gamecode}/host`)
      }
    }
  }
}
