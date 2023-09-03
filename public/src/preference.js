/**
 * 초기 form제출 전 설정 함수
 */
const form = document.getElementById('search-form');
form.addEventListener('submit', function (event) {
  event.preventDefault(); // 폼 자동 제출 방지

  const categorySelect = document.getElementById('search-category');
  const selectedCategory =
    categorySelect.options[categorySelect.selectedIndex].value;
  if (selectedCategory === '선호 메뉴') {
    searchFavorites();
  } else if (selectedCategory === '제외 메뉴') {
    searchExcludeFoods();
  } else if (selectedCategory === '제외 재료') {
    searchExcludeIngredients();
  } else {
    alert('카테고리를 선택해주세요!');
  }
});

/**
 * 선호 메뉴 검색함수
 */
function searchFavorites() {
  const searchInput = document.getElementById('survey-search-input');
  const searchValue = searchInput.value.trim();
  console.log(searchValue);

  axios({
    method: 'post',
    url: 'http://localhost:3000/user-actions/favorites',
    data: {
      foodName: searchValue,
    },
  })
    .then(function (res) {
      console.log(res);
      console.log('서버에 데이터 보내기 성공!');
    })
    .catch(error => {
      console.log(error);
      alert(error.response.data.message);
    });
}
/**
 * 제외 음식 검색 함수
 */
function searchExcludeFoods() {
  const searchInput = document.getElementById('survey-search-input');
  const searchValue = searchInput.value.trim();
  console.log(searchValue);

  axios({
    method: 'post',
    url: 'http://localhost:3000/user-actions/exclude-foods',
    data: {
      foodName: searchValue,
    },
  })
    .then(function (res) {
      console.log(res);
      console.log('서버에 데이터 보내기 성공!');
    })
    .catch(error => {
      console.log(error);
      alert(error.response.data.message);
    });
}
/**
 * 제외 재료 검색 함수
 */
function searchExcludeIngredients() {
  const searchInput = document.getElementById('survey-search-input');
  const searchValue = searchInput.value.trim();
  console.log(searchValue);

  axios({
    method: 'post',
    url: 'http://localhost:3000/user-actions/exclude-ingredients',
    data: {
      foodName: searchValue,
    },
  })
    .then(function (res) {
      console.log(res);
      console.log('서버에 데이터 보내기 성공!');
    })
    .catch(error => {
      console.log(error);
      alert(error.response.data.message);
    });
}

/**
 * 선호 메뉴를 동적으로 생성하는 함수
 */
document.addEventListener('DOMContentLoaded', () => {
  const createFavoriteItems = callFavorites => {
    const favoritesList = document.querySelector('#favoriteList');
    callFavorites.forEach(food => {
      const newFavoriteItem = document.createElement('div');
      newFavoriteItem.classList.add(
        'col-lg-3',
        'col-md-4',
        'col-sm-6',
        'likes',
      );
      newFavoriteItem.innerHTML = `
        <div class="featured__item">
          <div class="featured__item__text">
            <h6>${food}</h6>
          </div>
        </div>
      `;
      favoritesList.appendChild(newFavoriteItem);
    });
  };

  // 필터링을 처리하는 함수
  const handleFiltering = () => {
    const filterButtons = document.querySelectorAll(
      '.featured__controls ul li',
    );
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        const itemsToDisplay = document.querySelectorAll(filterValue);

        // 모든 아이템을 숨깁니다.
        document.querySelectorAll('.featured__item').forEach(item => {
          item.style.display = 'none';
        });

        // 선택한 필터에 해당하는 아이템만 표시합니다.
        itemsToDisplay.forEach(item => {
          item.style.display = 'block';
        });
      });
    });
  };

  // 선호 메뉴 조회
  document.querySelector('#likeBtn').addEventListener('click', async () => {
    const callServer = await axios({
      method: 'get',
      url: 'http://localhost:3000/user-actions/favorites',
    });
    const callFavorites = callServer.data;
    createFavoriteItems(callFavorites);
    handleFiltering();
  });

  // 제외한 음식 조회
  document
    .querySelector('#excludeFoodBtn')
    .addEventListener('click', async () => {
      const callServer = await axios({
        method: 'get',
        url: 'http://localhost:3000/user-actions/exclude-foods',
      });
      const callExcluded = callServer.data;
      createFavoriteItems(callExcluded);
      handleFiltering();
    });
  // 제외한 재료 조회
  document
    .querySelector('#excludeIngredientBtn')
    .addEventListener('click', async () => {
      const callServer = await axios({
        method: 'get',
        url: 'http://localhost:3000/user-actions/exclude-ingredients',
      });
      const callExcludedIngredient = callServer.data;
      createFavoriteItems(callExcludedIngredient);
      handleFiltering();
    });
  // 제외한 재료가 포함된 음식 조회
  document
    .querySelector('#excludeInFoodBtn')
    .addEventListener('click', async () => {
      const callServer = await axios({
        method: 'get',
        url: 'http://localhost:3000/user-actions/exclude-foods-ingredients',
      });
      const callExcludedInfood = callServer.data;
      createFavoriteItems(callExcludedInfood);
      handleFiltering();
    });
});

