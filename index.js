const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3001',
    // origin: '*', // no cors!
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  }
})
const latex = require('node-latex')
const { createReadStream, createWriteStream, writeFile } = require('fs')
const { join } = require('path')

const myTex = String.raw`\documentclass{article}
\begin{document}
  Hello World!
\end{document}`

writeFile('input.tex', myTex, function (err) {
  if (err) return console.log(err)
  console.log('Hello World > helloworld.txt')
})

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

// const input = fs.createReadStream('input.tex')
// const output = fs.createWriteStream('output.pdf')
// const pdf = latex(input)

// pdf.pipe(output)
// pdf.on('error', err => console.error(err))
// pdf.on('finish', () => console.log('PDF generated!'))
const input = createReadStream(join(__dirname, 'input.tex'))
const output = createWriteStream(join(__dirname, 'output.pdf'))

latex(input).pipe(output)
