//모달 창 생성
const signupLink = document.getElementById('signupLink');
const signupModal = document.getElementById('signupModal');

signupLink.addEventListener('click', () => {
  signupModal.style.display = 'block';
});

window.addEventListener('click', event => {
  if (event.target === signupModal) {
    signupModal.style.display = 'none';
  }
});

window.addEventListener('click', event => {
  if (event.target === loginModal) {
    loginModal.style.display = 'none';
  }
});
const loginLink = document.getElementById('loginLink');
const loginModal = document.getElementById('loginModal');

loginLink.addEventListener('click', () => {
  loginModal.style.display = 'block';
});

window.addEventListener('click', event => {
  if (event.target === loginModal) {
    loginModal.style.display = 'none';
  }
});

// 모달을 닫는 함수
function closeModal() {
  var modal = document.getElementById('signupModal');
  modal.style.display = 'none';
}

// 로그인모달 닫는 함수
function closeModal() {
  const modal = document.getElementById('loginModal');
  modal.style.display = 'none';
}

// 모달 여는 함수
function openModal() {
  var modal = document.getElementById('signupModal');
  modal.style.display = 'block';
}

// 회원가입, 로그인 백엔드 연결

// 이메일 전송
function verifyEmail() {
  const data = {
    email: $('#email').val(),
  };
  if (!email) {
    alert('이메일을 입력해주세요');
    return;
  }
  axios
    .post('https://togethereat.shop/users/send-code', data)
    .then(response => {
      console.log(data);
      alert('메일을 전송했습니다.');
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
  const data = {
    email: $('#email').val(),
    code: $('#Code').val(),
  };

  axios
    .post('https://togethereat.shop/users/verify-code', data)
    .then(response => {
      console.log(data);
      alert('인증 확인');
    })
    .catch(error => {
      // 에러 처리
      alert('인증 실패');
      console.error(error);
    });
}

//회원가입
function sign(event) {
  // event.preventDefault(); // 기본 동작 방지
  const isAdmin = document.getElementById('admin').checked ? 1 : 0;
  const data = {
    is_admin: isAdmin,
    email: $('#email').val(),
    nick_name: $('#signupNickname').val(),
    password: $('#signupPassword').val(),
    passwordConfirm: $('#signupPasswordConfirm').val(),
  };

  axios
    .post('https://togethereat.shop/users/sign', data)
    .then(response => {
      console.log(data);
      alert('회원가입 완료');
      closeModal();
    })
    .catch(error => {
      // 에러 처리
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
    .post('https://togethereat.shop/users/login', data)
    .then(response => {
      console.log(data);
      alert('로그인 완료');
      closeModal();
      document.cookie = 'isLoggedIn=true'; // 예시로 "isLoggedIn" 쿠키 사용
      createLogoutButton();
      const mypageButton = document.getElementById('mypageLink');
      mypageButton.style.display = 'block';
    })
    .catch(error => {
      // 에러 처리
      alert('로그인 실패');
      console.error(error);
    });
}

// 홈 페이지 로딩 시 로그인 상태 확인
window.onload = function () {
  const isLoggedIn = getCookie('isLoggedIn');
  if (isLoggedIn === 'true') {
    createLogoutButton();
  }
};

// 쿠키 가져오기 함수
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return value;
    }
  }
  return '';
}

// "마이페이지" 링크를 보이게 하는 함수
function showMyPageLink() {
  const myPageLink = document.getElementById('myPageLink');
  myPageLink.style.display = 'inline'; // 보이게 설정
}

function createLogoutButton() {
  const loginLink = document.getElementById('loginLink');
  loginLink.innerHTML = '<i class="fa fa-user"></i>로그아웃';
  loginLink.removeAttribute('onclick'); // 이전의 클릭 이벤트를 제거

  // 새로운 클릭 이벤트를 추가하여 로그아웃 함수를 호출
  loginLink.addEventListener('click', function () {
    singOut();
    closeModal();
  });
}

// 로그아웃
function singOut() {
  axios
    .delete('https://togethereat.shop/users/logOut')
    .then(response => {
      alert('로그아웃 완료');
      document.cookie =
        'isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
    .post('https://togethereat.shop/users/admin')
    .then(response => {
      alert('어드민 변환 완료');
      location.reload();
    })
    .catch(error => {
      alert('어드민 변환 실패');
      console.error(error);
    });
}
