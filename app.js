const express = require('express'); //설치한 express 모듈 불러오기
const socket = require('socket.io'); //설치한 socket.io 모듈 불러오기
const http = require('http'); //Node.js 기본 내장 모듈 불러오기
const fs = require('fs'); // Node.js 기본 내장 모듈 불러오기
const { on } = require('events');
const app = express(); //express 객체 생성
const server = http.createServer(app) //express http 서버 생성
const io = socket(server); //생성된 서버를 socket.io에 바인딩

app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

app.get('/', function (request, response) { //get방식으로 /경로에 접속하면 실행됨
  fs.readFile('./static/index.html', function (err, data) {
    if (err) {
      response.send('에러')
    } else {
      response.writeHead(200, { 'Content-Type': 'text/html' })
      response.write(data)
      response.end()
    }
  })
})

io.sockets.on('connection', function (socket) {
  socket.on('newUser', function (name) {
    console.log(name + ' 님이 접속하였습니다.');
    socket.name = name
    io.sockets.emit('update', { type: 'connect', name: 'SERVER', message: name + ' 님이 접속하였습니다.' })
  })

  socket.on('message', function (data) {
    data.name = socket.name

    console.log(data);
    socket.broadcast.emit('update', data);
  })

  socket.on('disconnect', function () {
    console.log(socket.name + '님이 나가셨습니다.');
    socket.broadcast.emit('update', { type: 'disconnect', name: 'SERVER', message: socket.name + '님이 나가셨습니다.' })
  })
})

server.listen(8080, function () { //서버를 8080 포트로 listen
  console.log('서버 실행중...');
})