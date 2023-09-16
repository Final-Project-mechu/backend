// 오늘의 날짜를 가져옴
const today = new Date().toDateString();

// localStorage에서 저장된 날짜와 음식 정보
const savedDate = localStorage.getItem('randomFoodDate');
const savedFood = localStorage.getItem('randomFood');

if (savedDate === today && savedFood) {
  const foodElement = document.querySelector('.header__cart__price span');
  foodElement.textContent = savedFood;
} else {
  // 저장된 날짜가 없거나 다르면 새로운 음식 정보를 가져와서 저장
  axios
    .get('https://togethereat.shop/food')
    .then(res => {
      const foodList = res.data.map(item => item.food_name);
      const randomFood = foodList[Math.floor(Math.random() * foodList.length)];
      const foodElement = document.querySelector('.header__cart__price span');
      foodElement.textContent = randomFood;

      localStorage.setItem('randomFoodDate', today);
      localStorage.setItem('randomFood', randomFood);
    })
    .catch(error => {
      console.error('Error fetching food list:', error);
    });
}
