const Host = require('./host')

class Game {
  constructor (name, password) {
    this.counting = false
    this.host = new Host()
    this.id = Date.now()
    this.name = name
    this.password = password
    this.players = {}
    this.questions = []
    this.seconds = 30
  }
}

module.exports = Game
