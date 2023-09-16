// "카카오로 로그인하기" 버튼 클릭 이벤트 핸들러
document
  .getElementById('kakaoLoginButton')
  .addEventListener('click', async () => {
    try {
      // 1. 카카오 로그인 요청
      const loginResponse = await axios.get(
        'https://togethereat.shop/auth/kakaoLoginLogic',
      );

      // 2. 카카오 액세스 토큰 발급 및 리다이렉트
      if (loginResponse.status === 200) {
        // 로그인 성공 시, 백엔드에서 리다이렉트된 페이지로 이동
        window.location.href = loginResponse.data;
      } else {
        // 로그인 실패 시, 처리
        console.error('카카오 로그인 실패');
      }
    } catch (error) {
      console.error(error);
    }
  });
// 카카오 액세스 토큰 및 사용자 정보 요청 연결을 위한 JavaScript 코드
// 이 코드는 HTML 파일에서 로딩됩니다.

// 카카오 액세스 토큰 요청 및 사용자 정보 요청 함수
async function getKakaoAccessTokenAndUserInfo() {
  try {
    // 3. 카카오 액세스 토큰 요청 (백엔드에서 리다이렉트로 받음)
    const accessTokenResponse = await axios.get(
      'https://togethereat.shop/auth/kakaoLoginLogicRedirect',
    );

    // 4. 카카오 사용자 정보 요청
    if (accessTokenResponse.status === 200) {
      const infoResponse = await axios.get(
        'https://togethereat.shop/auth/kakaoInfo',
      );
      if (infoResponse.status === 200) {
        // 사용자 정보를 처리
        console.log('카카오 사용자 정보:', infoResponse.data);
      } else {
        console.error('카카오 사용자 정보 요청 실패');
      }
    } else {
      console.error('카카오 액세스 토큰 요청 실패');
    }
  } catch (error) {
    console.error(error);
  }
}

// 페이지 로드 후 카카오 소셜 로그인 프로세스 시작
window.addEventListener('load', () => {
  getKakaoAccessTokenAndUserInfo();
});
