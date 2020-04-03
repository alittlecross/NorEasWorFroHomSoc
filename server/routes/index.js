module.exports = {
  create: require('./pre-join/create'),
  error: require('./error'),
  game: require('./post-join/game'),
  guide: require('./guide'),
  host: require('./post-join/host'),
  index: require('./pre-join/index'),
  join: require('./pre-join/join'),
  question: require('./post-join/question')
}
