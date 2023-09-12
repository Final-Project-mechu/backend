// 오늘의 메뉴 랜덤 get
axios
  .get('http://localhost:3000/food')
  .then(res => {
    // 응답에서 음식 목록을 가져옵니다.
    const foodList = res.data.map(item => item.food_name);

    // 음식 목록 중 랜덤하게 하나를 선택합니다.
    const randomFood = foodList[Math.floor(Math.random() * foodList.length)];

    // 선택된 음식으로 HTML을 업데이트합니다.
    const foodElement = document.querySelector('.header__cart__price span');
    foodElement.textContent = randomFood;
  })
  .catch(error => {
    // 서버에서 발생한 예외 처리
    if (error.response) {
      // 서버가 응답을 보낸 경우
      const errorMessage = error.response.data.message;
      alert('회원가입 실패: ' + errorMessage);
    } else {
      // 서버로 요청을 보내는 동안 네트워크 오류 등의 문제가 발생한 경우
      console.error('네트워크 오류:', error.message);
      alert('네트워크 오류가 발생했습니다.');
    }
  });
