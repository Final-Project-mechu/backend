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
// 선호 메뉴 조회
document.addEventListener('DOMContentLoaded', () => {
  const favoritesInfo = async () => {
    const callServer = await axios({
      method: 'get',
      url: 'http://localhost:3000/user-actions/favorites',
    });
    const callFavorites = callServer.data;
    const favoritesList = document.querySelector('#favorite-food');
    console.log(callFavorites);
    console.log(favoritesList);

    callFavorites.forEach(favorites => {
      favoritesList.innerHTML += `<h6 id="favorite-food">${favorites}</a></h6>`;
    });
  };
  favoritesInfo();
});

// 제외 음식 GET 함수

// 제외 재료 GET 함수

// 제외 재료 포함 음식 GET 함수
