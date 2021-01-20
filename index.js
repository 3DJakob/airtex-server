const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

http.listen(3000, () => {
  console.log('listening on *:3000')
})

let document = 'Test'

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.emit('refresh', document)
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('document', (text) => {
    console.log('document: ' + text)
    document = text
    socket.broadcast.emit('refresh', text)
  })
})
