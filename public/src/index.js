// 회원가입, 로그인 백엔드 연결
// 처음 HTML 정보 불러오기
document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.querySelector('.loginClick')
  const signupButton = document.querySelector('.signClick')
})



// 이메일 전송
let verifyingEmail;
function verifyEmail() {
  const emailInput = document.getElementById('signupEmail');
  const emailButton = document.getElementById('signupEmailBtn');
  const data = {
    email: $('#signupEmail').val(),
  };
  if (!data.email) {
    alert('이메일을 입력해주세요');
    return;
  }
  axios
    .post('http://localhost:3000/users/send-code', data)
    .then(response => {
      console.log(data);
      alert('인증코드가 이메일로 전송되었습니다.');
      emailInput.disabled = true;
      emailButton.disabled = true;
      verifyingEmail = data.email;
    })
    .catch(error => {
      alert(error.response.data.message);
      console.log(error);
    });
}

// 이메일 인증
function verifyCode() {
  const codeInput = document.getElementById('codeInput');
  const codeInputButton = document.getElementById('codeInputButton');
  const data = {
    email: verifyingEmail,
    code: $('#codeInput').val(),
  };
  console.log(data);

  axios
    .post('http://localhost:3000/users/verify-code', data)
    .then(response => {
      console.log(data);
      alert('인증 확인');
      codeInput.disabled = true;
      codeInputButton.disabled = true;
    })
    .catch(error => {
      alert(error.message);
      console.error(error);
    });
}

//회원가입
function sign(event) {
  event.preventDefault();
  if (!document.getElementById('signupEmail').disabled) {
    return alert('E-mail 인증 먼저 진행해주세요.');
  }
  if (!document.getElementById('codeInputButton').disabled) {
    return alert('E-mail 인증 먼저 진행해주세요.');
  }
  const isAdmin = document.getElementById('admin').checked ? 1 : 0;
  const data = {
    is_admin: isAdmin,
    email: verifyingEmail,
    nick_name: $('#signupNickname').val(),
    password: $('#signupPassword').val(),
    passwordConfirm: $('#signupPasswordConfirm').val(),
  };
  axios
    .post('http://localhost:3000/users/sign', data)
    .then(response => {
      alert(response.message);
      location.reload();
    })
    .catch(error => {
      alert(error.response.message);
    });
}

// 로그인
function login() {
  const data = {
    email: $('#loginEmail').val(),
    password: $('#loginPass').val(),
  };
  axios
    .post('http://localhost:3000/users/login', data)
    .then(response => {
      console.log(response);
      location.reload();
      // createLogoutButton();
    })
    .catch(error => {
      // 에러 처리
      alert(error.response.message);
    });
}

// 로그아웃 버튼을 생성하고 로그인 링크를 변경하는 함수
function createLogoutButton() {
  const loginLink = document.getElementById('loginLink');
  loginLink.innerHTML = '<i class="fa fa-user"></i>로그아웃';
  loginLink.removeAttribute('onclick'); // 이전의 클릭 이벤트를 제거

  // 새로운 클릭 이벤트를 추가하여 로그아웃 함수를 호출
  loginLink.addEventListener('click', function () {
    singOut();
  });
}

// 로그아웃
function singOut() {
  axios
    .delete('http://localhost:3000/users/logOut')
    .then(response => {
      alert('로그아웃 완료');
      // 로그아웃이 완료된 경우 다시 로그인 링크로 변경
      resetLoginLink();
      location.reload();
    })
    .catch(error => {
      alert('로그아웃 실패');
      console.error(error);
    });
}

//어드민 변환
function admintransfer() {
  axios
    .post('http://localhost:3000/users/admin')
    .then(response => {
      alert('어드민 변환 완료');
      location.reload();
    })
    .catch(error => {
      alert('어드민 변환 실패');
      console.error(error);
    });
}
