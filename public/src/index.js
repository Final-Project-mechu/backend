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

// 회원가입 백엔드 연결

// 모달 닫는 함수
function closeModal() {
  const signupModal = document.getElementById('signupModal');
  signupModal.style.display = 'none';
}

function verifyEmail() {
  const email = $('#email').val();
  console.log(email);
  if (!email) {
    alert('이메일을 입력해주세요');
    return;
  }
  axios
    .post('http://localhost:3000/users/send-code')
    .then(response => {
      console.log(data);
      closeModal();
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

function verifyCode() {
  const data = {
    email: $('#email').val(),
    code: $('#code').val(),
  };
  axios.post(
    'http://localhost:3000/users/verify-code',
    data
      .then(response => {
        console.log(data);
        alert('인증 확인');
        closeModal();
        event.preventDefault();
      })
      .catch(error => {
        // 에러 처리
        alert('인증 실패');
        event.preventDefault();
        console.error(error);
      }),
  );
}

// function sendCode() {
//   const email = document.getElementById('signupEmail').value;
//   const data = { email, code };
//   axios
//     .post('http://localhost:3000/users/send-code', data)
//     .then(response => {
//       if (response.status === 200) {
//         alert('인증번호가 전송되었습니다.');
//       } else {
//         alert('인증번호 전송에 실패했습니다.');
//       }
//     })
//     .catch(error => {
//       alert('인증번호 전송에 실패했습니다.');
//       console.error(error);
//     });
// }

function sign(event) {
  const data = {
    is_admin: $('#admin').val(),
    email: $('#email').val(),
    // code: $('#verifyCode'),
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
      event.preventDefault();
    })
    .catch(error => {
      // 에러 처리
      alert('회원가입 실패');
      event.preventDefault();
      console.error(error);
    });
}

function login() {
  const data = {
    email: $('#Email').val(),
    password: $('#Password').val(),
  };
  axios
    .post('http://localhost:3000/users/login', data)
    .then(response => {
      console.log(data);
      closeModal();
      alert('로그인 완료');
    })
    .catch(error => {
      if (error.response) {
        // 서버 응답이 있는 경우 (HTTP 에러 상태 코드)
        console.log('응답 데이터:', error.response.data);
        console.log('상태 코드:', error.response.status);
      } else if (error.request) {
        // 요청이 전송되었으나 응답을 받지 못한 경우
        console.log('요청:', error.request);
      } else {
        // 에러를 발생시킨 요청을 만들기 전에 발생한 경우
        console.log('에러 메시지:', error.message);
      }
      alert('로그인 실패');
      console.log(data);
    });
  console.log(data);
}

// document.addEventListener('DOMContentLoaded', function () {
//   const loginButton = document.querySelector('.login-button');
//   const logoutButton = document.querySelector('.logout-button');

//   //로그인
//   const modalLoginButton = document.querySelector(
//     '#loginModal button.btn-primary',
//   );

//   modalLoginButton.addEventListener('click', function () {
//     const email = document.querySelector('#email-login').value;
//     const password = document.querySelector('#password-login').value;
//     const loginError = document.querySelector('#loginError');
//     const loginModal = new bootstrap.Modal(
//       document.getElementById('loginModal'),
//     );

//     // 데이터 객체 생성
//     const userData = {
//       email: email,
//       password: password,
//     };

//     // Axios를 사용하여 POST 요청 보내기
//     axios
//       .post('http://localhost:3000/users/login', userData) // 실제 백엔드 URL로 수정해야 합니다
//       .then(response => {
//         // 성공 메시지 표시
//         const successMessage = document.createElement('div');
//         successMessage.classList.add('alert', 'alert-success', 'mt-3');
//         successMessage.textContent = '로그인이 성공적으로 완료되었습니다.';

//         const modalBody = document.querySelector('#loginModal .modal-body');
//         modalBody.appendChild(successMessage);

//         location.reload();
//       })
//       .catch(error => {
//         console.log(error);

//         if (error.response && error.response.data) {
//           // 에러 메시지를 모달에 추가
//           loginError.textContent =
//             '로그인에 실패했습니다. ' + error.response.data.message;
//           loginError.style.display = 'block'; // 에러 메시지 표시

//           // 모달 표시
//           loginModal.show();
//         }
//       });
//   });
// });
