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
    if (cookies.includes('AccessToken', 'RefreshToken')) {
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
      alert('인증코드가 이메일로 전송되었습니다.');
      emailInput.disabled = true;
      emailButton.disabled = true;
      verifyingEmail = data.email;
    })
    .catch(error => {
      alert(error.response.data.message);
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

  const data = {
    is_admin: 0,
    email: verifyingEmail,
    nick_name: $('#signupNickname').val(),
    password: $('#signupPassword').val(),
    passwordConfirm: $('#signupPasswordConfirm').val(),
  };
  axios
    .post('https://togethereat.shop/users/sign', data)
    .then(response => {
      setCookie('AccessToken', response.data.AccessToken, 1);
      setCookie('RefreshToken', response.data.RefreshToken, 1);
      alert(
        '회원가입을 축하합니다! 고객님의 취향을 저격하기 위해 선호도 조사 페이지로 이동합니다!',
      );
      // 회원가입 되면 바로 선호도조사 페이지로 이동
      location.href = 'https://togethereat.shop/preference.html';
    })
    .catch(error => {
      // 서버에서 발생한 예외 처리
      if (error.response) {
        // 서버가 응답을 보낸 경우
        const errorMessage = error.response.data.message;
        alert('회원가입에 실패하였습니다.');
      } else {
        // 서버로 요청을 보내는 동안 네트워크 오류 등의 문제가 발생한 경우
        console.error('네트워크 오류:', error.message);
        alert('네트워크 오류가 발생했습니다.');
      }
    });
}

function setCookie(cookie_name, value, days) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + days);
  // 설정 일수만큼 현재시간에 만료값으로 지정
  const cookie_value =
    value + (days == null ? '' : '; expires =' + exdate.toUTCString());
  document.cookie = cookie_name + '=' + cookie_value;
}

function deleteCookie(name) {
  setCookie(name, '', -1);
}

// 로그아웃
function signOut() {
  document.cookie = deleteCookie('AccessToken');
  document.cookie = deleteCookie('RefreshToken');
  alert('로그아웃 되었습니다.');
  location.href = 'https://togethereat.shop';
}

// 로그인
function login() {
  const data = {
    email: $('#loginEmail').val(),
    password: $('#loginPass').val(),
  };
  axios
    .post('https://togethereat.shop/users/login', data)
    .then(response => {
      setCookie('AccessToken', response.data.AccessToken, 1);
      setCookie('RefreshToken', response.data.RefreshToken, 1);
      alert('고객님 또 와주셨군요 ! 메뉴 추천 페이지로 이동합니다 !^ㅠ^');
      location.href = 'https://togethereat.shop/menu-subscribe.html';
    })
    .catch(error => {
      // 서버에서 발생한 예외 처리
      if (error.response) {
        // 서버가 응답을 보낸 경우
        const errorMessage = error.response.data.message;
        alert('로그인 실패: ' + '이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        // 서버로 요청을 보내는 동안 네트워크 오류 등의 문제가 발생한 경우
        alert('네트워크 오류가 발생했습니다.');
      }
    });
}
