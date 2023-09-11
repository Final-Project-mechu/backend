// 오늘의 메뉴 랜덤 get 
axios.get('http://localhost:3000/food')
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
        console.error('Error fetching food list:', error);
    });