// 회원가입, 로그인 백엔드 연결
// 처음 HTML 정보 불러오기
document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.querySelector('.loginClick');
  const signupButton = document.querySelector('.signClick');
  const logoutButton = document.querySelector('.logoutClick');
  const mypageButton = document.querySelector('.mypageClick');
  const favoritesButton = document.querySelector('.favoriteClick');
  // 쿠키값 확인하여 버튼 상태 설정
  function checkLoginStatus() {
    let cookies = document.cookie;
    if (cookies.includes('AccessToken=Bearer%20')) {
      loginButton.classList.add('d-none');
      signupButton.classList.add('d-none');
      logoutButton.classList.remove('d-none');
      mypageButton.classList.remove('d-none');
      favoritesButton.classList.remove('d-none');
    }
  }
  checkLoginStatus();
  document.addEventListener('cookieChange', checkLoginStatus);
});

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
    .post('https://togethereat.shop/users/send-code', data)
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
    .post('https://togethereat.shop/users/verify-code', data)
    .then(response => {
      alert('인증 확인');
      codeInput.disabled = true;
      codeInputButton.disabled = true;
    })
    .catch(error => {
      alert(error.message);
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
    .post('https://togethereat.shop/users/sign', data)
    .then(response => {
      alert(
        '회원가입을 축하합니다! 고객님의 취향을 저격하기 위해 선호도 조사 페이지로 이동합니다!',
      );
      // 회원가입 되면 바로 선호도조사 페이지로 이동
      location.href = 'http://localhost:3000/preference.html';
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
      // 로그인하면 바로 메뉴추천 페이지로 이동
      alert('고객님 또 와주셨군요 ! 메뉴 추천 페이지로 이동합니다 !^ㅠ^');
      location.href = 'http://localhost:3000/menu-subscribe.html';
    })
    .catch(err => {
      alert(err.response.data.message);
    });
}

// 로그아웃
function signOut() {
  axios
    .delete('http://localhost:3000/users/logout')
    .then(response => {
      alert(response.data);
      location.reload();
    })
    .catch(error => {
      alert('로그아웃 실패');
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
    });
}
