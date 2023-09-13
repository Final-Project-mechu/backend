window.onload = function () {
  let cookies = document.cookie;
  if (!cookies.includes('AccessToken=Bearer%20')) {
    alert('로그인이 필요한 기능입니다.');
    window.location.href = 'https://togethereat.shop/index.html';
  }
};
