// 친구요청 모달 창 열기
document.getElementById('friend').addEventListener('click', function () {
  document.getElementById('myModal').style.display = 'block';
});

// 친구수락 모달 창 열기
document.getElementById('friendAccept').addEventListener('click', function () {
  document.getElementById('myModalAccpet').style.display = 'block';
});

// 친구거절 모달 창 열기
document.getElementById('friendReject').addEventListener('click', function () {
  document.getElementById('myModalReject').style.display = 'block';
});

// 친구요청 모달 창 닫기
document
  .getElementsByClassName('close')[0]
  .addEventListener('click', function () {
    document.getElementById('myModal').style.display = 'none';
  });

// 친구수락 모달 창 닫기
document
  .getElementsByClassName('close')[0]
  .addEventListener('click', function () {
    document.getElementById('myModalAccpet').style.display = 'none';
  });

// 친구거절 모달 창 닫기
document
  .getElementsByClassName('close')[0]
  .addEventListener('click', function () {
    document.getElementById('myModalReject').style.display = 'none';
  });

// 친구요청 모달 창 외부 클릭 시 닫기
window.addEventListener('click', function (event) {
  if (event.target == document.getElementById('myModal')) {
    document.getElementById('myModal').style.display = 'none';
  }
});

// 친구수락 모달 창 외부 클릭 시 닫기
window.addEventListener('click', function (event) {
  if (event.target == document.getElementById('myModalAccpet')) {
    document.getElementById('myModalAccpet').style.display = 'none';
  }
});

// 친구거절 모달 창 외부 클릭 시 닫기
window.addEventListener('click', function (event) {
  if (event.target == document.getElementById('myModalReject')) {
    document.getElementById('myModalReject').style.display = 'none';
  }
});

function addFriend() {
  const data = {
    sender: $('#sender').val(),
    receiverEmail: $('#requestTarget').val(),
    status: $('#status').val(),
  };
  axios
    .post('http://localhost:3000/friends/send-request', data)
    .then(response => {
      console.log(data);
      alert('친구 요청을 보냈습니다.');
    })
    .catch(error => {
      alert('친구 요청 실패');
      console.log(error);
      console.log(error.response);
    });
}

function accpetFriend() {
  const data = {
    sender: $('#senderEmail').val(),
    receiverEmail: $('#requestTargetEmail').val(),
    status: $('#status2').val(),
  };
  axios
    .post('http://localhost:3000/friends/accept-friend', data)
    .then(response => {
      console.log(data);
      alert('친구 요청을 수락했습니다.');
    })
    .catch(error => {
      alert('친구 수락 실패');
      console.log(error);
      console.log(error.response);
    });
}

function rejectFriend() {
  const data = {
    sender: $('#senderEmail2').val(),
    receiverEmail: $('#requestTargetEmail2').val(),
    status: $('#status3').val(),
  };
  console.log(data);
  axios
    .post('http://localhost:3000/friends/reject-friend', data)
    .then(response => {
      console.log(data);
      alert('친구 요청을 거절했습니다.');
      location.reload();
    })
    .catch(error => {
      alert('친구 거절 실패');
      console.log(error);
      console.log(error.response);
    });
}
