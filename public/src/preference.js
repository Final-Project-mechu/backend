if (!window.location.hash) {
  window.location = window.location + '#loaded';
  window.location.reload();
  }


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
      alert('선호 메뉴에 추가되었습니다.');
      location.reload(); // 페이지 새로고침
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
      alert('제외 음식에 추가되었습니다.'); // 추가된 알림 창
      location.reload(); // 페이지 새로고침
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
      ingredientName: searchValue,
    },
  })
    .then(function (res) {
      console.log(res);
      alert('제외 재료에 추가되었습니다.'); // 추가된 알림 창
      location.reload(); // 페이지 새로고침
    })
    .catch(error => {
      console.log(error);
      alert(error.response.data.message);
    });
}
/**
 * 선호 메뉴를 동적으로 생성하는 함수
 * @param {Array} items - 표시할 아이템들의 배열
 * @param {string} className - 아이템에 추가할 클래스 이름
 */
function createItems(items, className) {
  const list = document.querySelector('#favoriteList');
  list.innerHTML = '';
  items.forEach(item => {
    const newItem = document.createElement('div');
    newItem.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', className);
    newItem.innerHTML = `
      <div class="featured__item">
        <div class="featured__item__text">
          ${
            className !== 'excluded-ing-foods'
              ? '<input type="checkbox" class="item-checkbox">'
              : ''
          }
          <h6>${item}</h6>
        </div>
      </div>
    `;
    list.appendChild(newItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let currentFilter = '';

  // 필터링을 처리하는 함수
  const handleFiltering = () => {
    const filterButtons = document.querySelectorAll(
      '.featured__controls ul li',
    );
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        currentFilter = filterValue.replace('.', ''); // 클래스 이름에서 점을 제거합니다.
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

  document.getElementById('prefer-delete').addEventListener('click', async () => {
    const checkedItems = document.querySelectorAll('.item-checkbox:checked');
    const itemsToDelete = Array.from(checkedItems)
      .map(checkbox =>
        checkbox.parentElement.querySelector('h6').textContent.trim(),
      )
      .filter(item => item);
  
    // 체크박스가 선택되지 않았을 경우 메시지 표시
    if (itemsToDelete.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }
  
    let url;
    let dataKey;
    if (currentFilter === 'favorites') {
      url = 'http://localhost:3000/user-actions/favorites-cancel';
      dataKey = 'foodName';
    } else if (currentFilter === 'excluded-foods') {
      url = 'http://localhost:3000/user-actions/exclude-foods-cancel';
      dataKey = 'foodName';
    } else if (currentFilter === 'excluede-ingredient') {
      url = 'http://localhost:3000/user-actions/exclude-ingredients-cancel';
      dataKey = 'ingredientName';
    } else {
      console.error('Invalid currentFilter value:', currentFilter); 
      return; 
    }
    try {
      for (const item of itemsToDelete) {
        console.log('Sending request for item:', item); 
        await axios({
          method: 'post',
          url: url,
          data: {
            [dataKey]: item,
          },
        });
      }
      alert('삭제되었습니다.');
      location.reload();
    } catch (error) {
      console.log(error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  });

  // 페이지 로드 시 handleFiltering 함수 호출
  handleFiltering();

  // 선호 메뉴 조회
document.querySelector('#likeBtn').addEventListener('click', async () => {
  const callServer = await axios({
    method: 'get',
    url: 'http://localhost:3000/user-actions/favorites',
  });
  const callFavorites = callServer.data;
  createItems(callFavorites, 'favorites');
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
      createItems(callExcluded, 'excluded-foods');
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
      createItems(callExcludedIngredient, 'excluede-ingredient');
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
      createItems(callExcludedInfood, 'excluded-ing-foods');
      handleFiltering();
    });
});

document.getElementById('the-menu').addEventListener('click', function () {
  const menuWindow = window.open('menu.html', '_blank', 'width=400,height=600');
  menuWindow.addEventListener('load', function () {


    const foodButton = menuWindow.document.createElement('button');
    foodButton.innerText = '음식';
    menuWindow.document.body.appendChild(foodButton);

    const ingredientButton = menuWindow.document.createElement('button');
    ingredientButton.innerText = '재료';
    menuWindow.document.body.appendChild(ingredientButton);

    // 내용을 표시할 컨테이너 생성
    const contentContainer = menuWindow.document.createElement('div');
    menuWindow.document.body.appendChild(contentContainer);

    foodButton.onclick = function () {
      axios
        .get('http://localhost:3000/food')
        .then(res => {
          const foodNames = res.data.map(item => item.food_name);
          console.log('foodNames', foodNames);
          contentContainer.innerHTML = ''; // 컨테이너 내부 초기화
          contentContainer.innerHTML += '<h2>음식</h2>';
          contentContainer.innerHTML += foodNames.join('<br>');
        })
        .catch(error => {
          console.error('Error fetching food list:', error);
        });
    };

    ingredientButton.onclick = function () {
      axios
        .get('http://localhost:3000/ingredient')
        .then(res => {
          const ingredientNames = res.data.map(item => item.ingredient_name);
          contentContainer.innerHTML = ''; 
          contentContainer.innerHTML += '<h2>재료</h2>';
          contentContainer.innerHTML += ingredientNames.join('<br>');
        })
        .catch(error => {
          console.error('Error fetching ingredient list:', error);
        });
    };
  });
});
