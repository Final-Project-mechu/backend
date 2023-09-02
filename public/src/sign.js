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
