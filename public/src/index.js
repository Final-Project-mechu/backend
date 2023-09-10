// 회원가입, 로그인 백엔드 연결

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
      alert('메일을 전송했습니다.');
      emailInput.disabled = true;
      emailButton.disabled = true;
      verifyingEmail = data.email;
    })
    .catch(error => {
      if (error.response) {
        // 서버 응답이 있는 경우 (HTTP 에러 상태 코드)
        console.log(
          '응답 데이터:',
          error.response.data,
          error.message,
          error.response.status,
        );
        console.log('상태 코드:', error.response.status);
      } else if (error.request) {
        // 요청이 전송되었으나 응답을 받지 못한 경우
        console.log('요청:', error.request);
      } else {
        // 에러를 발생시킨 요청을 만들기 전에 발생한 경우
        console.log('에러 메시지:', error.message);
      }
      alert('메일 전송 실패');
      console.log(data, error.message);
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
      // 에러 처리
      alert('인증 실패');
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
      console.log(data);
      alert('회원가입 완료');
      closeModal();
    })
    .catch(error => {
      console.error(error);
      alert('회원가입 실패');
    });
}

// 로그인
function login() {
  const data = {
    email: $('#Email').val(),
    password: $('#Password').val(),
  };
  axios
    .post('http://localhost:3000/users/login', data)
    .then(response => {
      console.log(data);
      alert('로그인 완료');
      // 로그인이 완료된 경우 로그아웃 버튼을 생성하고 로그인 링크를 변경
      createLogoutButton();
    })
    .catch(error => {
      // 에러 처리
      alert('로그인 실패');
      console.error(error);
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
