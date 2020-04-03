const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')

const app = express()
const flash = require('./server/plugins/flash')
const games = {}
const options = require('./server/plugins/session')
const port = process.env.PORT || 3000
const routes = require('./server/routes')
const server = require('http').createServer(app)

const io = require('socket.io')(server)
const session = require('express-session')

app.set('games', games)
app.set('io', io)
app.set('views', './server/views')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('./server/public'))
app.use(session(options))

app.use(flash)

app.get('/', routes.index)

app.get('/create', routes.create.get)
app.post('/create', routes.create.post)

app.get('/join/:gamecode?/:password?', routes.join.get)
app.post('/join/:gamecode?/:password?', routes.join.post)

app.get('/:gamecode/host', routes.host.get)
app.post('/:gamecode/host', routes.host.post)

app.get('/:gamecode/game', routes.game)

app.get('/:gamecode/question', routes.question.get)
app.post('/:gamecode/question', routes.question.post)

app.get('/guide', routes.guide)

app.get('*', routes.error)

server.listen(port)
