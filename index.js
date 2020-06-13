const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);

const title = 'TD_UK Buzzer'

let data = {
  users: new Set(),
  buzzes: new Set(),
}

const getData = () => ({
  users: [...data.users],
  buzzes: [...data.buzzes].map(b => {
    const [name] = b.split('-')
    return { name }
  })
})

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index', { title }))
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, getData())))

io.on('connection', (socket) => {
  socket.on('join', (user) => {
    data.users.add(user.name)
    io.emit('active', [...data.users])
    console.log(`${user.name} joined!`)
  })

  socket.on('buzz', (user) => {
    data.buzzes.add(`${user.name}`)
    io.emit('buzzes', [...data.buzzes])
    console.log(`${user.name} buzzed in!`)
  })

  socket.on('clear', () => {
    data.buzzes = new Set()
    io.emit('buzzes', [...data.buzzes])
    io.emit('reset', "Yes")
    console.log(`Clear buzzes`)
  })

  socket.on('disconnect', (user) => {
    console.log(`${socket.id} left!`)
  })
})

server.listen(8090, () => console.log('Listening on 8090'))
