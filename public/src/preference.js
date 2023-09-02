const form = document.getElementById('search-form');
form.addEventListener('submit', function (event) {
  event.preventDefault(); // 폼 자동 제출 방지

  const categorySelect = document.getElementById('search-category');
  const selectedCategory =
    categorySelect.options[categorySelect.selectedIndex].value;
  if (selectedCategory === '선호 메뉴') {
    searchFavorites();
  } else {
    console.log('다른 카테고리 선택됨');
  }
});

// 선호 메뉴 검색 함수
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
