// 사용하는 js 로직에 회원가입/로그인/로그아웃/마이페이지 기능 추가
// 회원가입, 로그인 백엔드 연결
// 처음 HTML 정보 불러오기
document.addEventListener('DOMContentLoaded', function () {
  const loginButton = document.querySelector('.loginClick');
  const signupButton = document.querySelector('.signClick');
  const logoutButton = document.querySelector('.logoutClick');
  const mypageButton = document.querySelector('.mypageClick');
  // 쿠키값 확인하여 버튼 상태 설정
  function checkLoginStatus() {
    let cookies = document.cookie;
    if (cookies.includes('Authentication=Bearer%20')) {
      loginButton.classList.add('d-none');
      signupButton.classList.add('d-none');
      logoutButton.classList.remove('d-none');
      mypageButton.classList.remove('d-none');
    }
  }
  checkLoginStatus();
  document.addEventListener('cookieChange', checkLoginStatus);
});

// 이메일 전송
let verifyingEmail;
function verifyEmail() {
  const emailInput = document.getElementById('signupEmail');
  const emailButton = document.getElementById('signupEmailBtn');
  const data = {
    email: $('#signupEmail').val(),
  };
  if (!data.email) {
    alert('이메일을 입력해주세요');
    return;
  }
  axios
    .post('http://localhost:3000/users/send-code', data)
    .then(response => {
      console.log(data);
      alert('인증코드가 이메일로 전송되었습니다.');
      emailInput.disabled = true;
      emailButton.disabled = true;
      verifyingEmail = data.email;
    })
    .catch(error => {
      alert(error.response.data.message);
      console.log(error);
    });
}

// 이메일 인증
function verifyCode() {
  const codeInput = document.getElementById('codeInput');
  const codeInputButton = document.getElementById('codeInputButton');
  const data = {
    email: verifyingEmail,
    code: $('#codeInput').val(),
  };
  console.log(data);

  axios
    .post('http://localhost:3000/users/verify-code', data)
    .then(response => {
      alert('인증 확인');
      codeInput.disabled = true;
      codeInputButton.disabled = true;
    })
    .catch(error => {
      alert(error.message);
    });
}

//회원가입
function sign(event) {
  event.preventDefault();
  if (!document.getElementById('signupEmail').disabled) {
    return alert('E-mail 인증 먼저 진행해주세요.');
  }
  if (!document.getElementById('codeInputButton').disabled) {
    return alert('E-mail 인증 먼저 진행해주세요.');
  }
  const isAdmin = document.getElementById('admin').checked ? 1 : 0;
  const data = {
    is_admin: isAdmin,
    email: verifyingEmail,
    nick_name: $('#signupNickname').val(),
    password: $('#signupPassword').val(),
    passwordConfirm: $('#signupPasswordConfirm').val(),
  };
  axios
    .post('http://localhost:3000/users/sign', data)
    .then(response => {
      alert(response.message);
      location.reload();
    })
    .catch(error => {
      alert(error.response.message);
    });
}

// 로그인
function login() {
  const data = {
    email: $('#loginEmail').val(),
    password: $('#loginPass').val(),
  };
  axios
    .post('http://localhost:3000/users/login', data)
    .then(response => {
      console.log(response);
      location.reload();
      createLogoutButton();
    })
    .catch(error => {
      // 에러 처리
      console.log(error);
      alert(error.response.message);
    });
}

// 로그아웃
function signOut() {
  axios
    .delete('http://localhost:3000/users/logout')
    .then(response => {
      alert(response.data);
      location.reload();
    })
    .catch(error => {
      alert('로그아웃 실패');
      console.error(error);
    });
}

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

  document
    .querySelector('.hero__search__phone')
    .addEventListener('click', async () => {
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
        console.error('Invalid currentFilter value:', currentFilter); // 로깅: 잘못된 currentFilter 값
        return; // 함수 종료
      }

      console.log('URL:', url); // 로깅: 요청 URL
      console.log('Data Key:', dataKey); // 로깅: 데이터 키
      console.log('Items to Delete:', itemsToDelete); // 로깅: 삭제할 아이템들

      try {
        for (const item of itemsToDelete) {
          console.log('Sending request for item:', item); // 로깅: 현재 요청 중인 아이템
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
  console.log('Opening the menu window...');
  const menuWindow = window.open('menu.html', '_blank', 'width=400,height=600');
  console.log('Opening the menu window222');

  menuWindow.addEventListener('load', function () {
    console.log('Opening the menu window5555');

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
          contentContainer.innerHTML = ''; // 컨테이너 내부 초기화
          contentContainer.innerHTML += '<h2>재료</h2>';
          contentContainer.innerHTML += ingredientNames.join('<br>');
        })
        .catch(error => {
          console.error('Error fetching ingredient list:', error);
        });
    };
  });
});
