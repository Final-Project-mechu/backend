window.onload = function () {
  let cookies = document.cookie;
  if (!cookies.includes('AccessToken', 'RefreshToken')) {
    alert('로그인이 필요한 기능입니다. 회원가입을 먼저 진행해주세요');
    window.location.href = 'https://togethereat.shop';
  }
};
