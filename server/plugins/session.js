module.exports = {
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRET || 'no-secret'
}
