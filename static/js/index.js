
var socket = io()

/* 접속 되었을 때 실행 */
socket.on('connect', function () {
  var name = prompt('반갑습니다.', '')

  if (!name) {
    name = '익명'
  }
  socket.emit('newUser', name)
})

socket.on('update', function (data) {
  console.log(`${data.name} : ${data.message}`);
})

/* 전송 함수 */
function send() {
  // 입력되어있는 데이터 가져오기
  var message = document.getElementById('test').value

  // 가져왔으니 데이터 빈칸으로 변경
  document.getElementById('test').value = ''

  // 서버로 send 이벤트 전달 + 데이터와 함께
  socket.emit('send', { type: 'message', message: message })
}