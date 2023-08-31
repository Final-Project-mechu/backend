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

function closeModal() {
  const signupModal = document.getElementById('signupModal');
  signupModal.style.display = 'none';
}

function sign() {
  const data = {
    is_admin: $('#admin').val(),
    email: $('#email').val(),
    nick_name: $('#signupNickname').val(),
    password: $('#signupPassword').val(),
  };

  axios
    .post('http://localhost:3000/users/sign', data)
    .then(response => {
      console.log(data);
      closeModal();
      alert('회원가입 완료');
    })
    .catch(error => {
      alert('회원가입 실패');
    });
  console.log(data);
}

function login() {
  const data = {
    email: $('#Email').val(),
    password: $('#Password').val(),
  };

  // { withCredentials: true }
  axios
    .post('http://localhost:3000/users/login', data)
    .then(response => {
      console.log(data);
      closeModal();
      alert('로그인 완료');
    })
    .catch(error => {
      alert('로그인 실패');
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
