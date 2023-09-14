window.onload = function () {
  let cookies = document.cookie;
  if (!cookies.includes('AccessToken', 'RefreshToken')) {
    alert('로그인이 필요한 기능입니다.');
    window.location.href = 'http://localhost:3000/index.html';
  }
};
