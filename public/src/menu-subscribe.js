let selectedCategoryId = 0;
let keywordResult;
let isRequestInProgress = false;
let currentKakaoPageEvent; // 현재 이벤트 리스너를 저장하기 위한 변수

const storeBtn = document.getElementById('storeBtn');
const submitButton = document.querySelector('.button[type="submit"]');
const imageContainer = document.querySelector('.image-container img');

function openKakaopage(keyword) {
  return () => {
    const kakaoUrl =
      'http://localhost:3000/kakaomap-api.html?keyword=' + keyword;
    window.open(kakaoUrl, '_blank');
  };
}

// 하트 아이콘
const emptyHeartIcon = document.querySelector('.far.fa-heart');
const filledHeartIcon = document.querySelector('.fas.fa-heart');

function likeFood() {
  const foodName = resultDiv.textContent.trim();

  axios
    .post('http://localhost:3000/user-actions/likes', { foodName: foodName })
    .then(response => {
      emptyHeartIcon.style.display = 'none';
      filledHeartIcon.style.display = 'inline-block';
    })
    .catch(error => {
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('요청 중 오류가 발생했습니다.');
      }
    });
}
// 빈 하트 아이콘 클릭 이벤트
emptyHeartIcon.addEventListener('click', function () {
  this.style.display = 'none';
  filledHeartIcon.style.display = 'inline-block';
});

function displayCategoryResponse(response) {
  setTimeout(() => {
    const resultDiv = document.getElementById('result3');
    // 최신 키워드만 가져오기
    const latestKeyword = Array.isArray(response.data) ? response.data[response.data.length - 1] : response.data;
    resultDiv.innerHTML = `<h2 style="font-family:Sunflower; color:#EB5A5A;">${latestKeyword}</h2>`;


    // 빈 하트로 초기화하고 표시
    emptyHeartIcon.style.display = 'inline-block';
    filledHeartIcon.style.display = 'none';
    storeBtn.style.display = 'block';

    keywordResult = latestKeyword; // 최신 키워드 저장

    // 이전 이벤트 리스너 제거
    if (currentKakaoPageEvent) {
      storeBtn.removeEventListener('click', currentKakaoPageEvent);
    }

    // 새로운 이벤트 리스너 추가
    currentKakaoPageEvent = openKakaopage(keywordResult);
    storeBtn.addEventListener('click', currentKakaoPageEvent);

    isRequestInProgress = false;
    submitButton.disabled = false;
  }, 3000);
}

const resultDiv = document.getElementById('result3'); // resultDiv 변수 선언 추가

emptyHeartIcon.addEventListener('click', function () {
  const foodName = resultDiv.textContent.trim();
  axios
    .post('http://localhost:3000/user-actions/likes', { foodName: foodName })
    .then(response => {
      // 성공적으로 요청이 완료되면 꽉 찬 하트로 변경합니다.
      emptyHeartIcon.style.display = 'none';
      filledHeartIcon.style.display = 'inline-block';
    })
    .catch(error => {
      // 오류가 발생하면 오류 메시지를 표시합니다.
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('요청 중 오류가 발생했습니다.');
      }
    });
});

// 꽉 찬 하트 아이콘 클릭 이벤트
filledHeartIcon.addEventListener('click', function () {
  const foodName = resultDiv.textContent.trim();

  axios
    .post('http://localhost:3000/user-actions/likes', { foodName: foodName })
    .then(response => {
      // 성공적으로 요청이 완료되면 빈 하트로 변경합니다.
      filledHeartIcon.style.display = 'none';
      emptyHeartIcon.style.display = 'inline-block';
    })
    .catch(error => {
      // 오류가 발생하면 오류 메시지를 표시합니다.
      if (error.response && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('요청 중 오류가 발생했습니다.');
      }
    });
});

function sendRequest(categoryId) {
  axios
    .post('http://localhost:3000/user-actions/random-weighted-foods', {
      category_id: categoryId,
    })
    .then(displayCategoryResponse)
    .catch(error => {
      alert('요청 중 오류가 발생했습니다.');
    });
}

function createCategoryButtons(categories) {
  const filterButtonsDiv = document.querySelector('.filter-buttons');
  const mainElement = document.querySelector('main');

  categories.forEach(category => {
    const button = document.createElement('button');
    button.id = `category_${category.id}`;
    button.className = 'filter-button';
    button.textContent = category.category_name;
    button.addEventListener('click', () => {
      document.querySelector(
        '.food-item.meal',
      ).textContent = `${category.category_name}가 선택되었습니다.`;
      selectedCategoryId = category.id;

      mainElement.style.display = 'block';
    });
    filterButtonsDiv.appendChild(button);
  });
}

axios
  .get('http://localhost:3000/category')
  .then(response => createCategoryButtons(response.data))
  .catch(error => {
    alert('요청 중 오류가 발생했습니다.');
  });

document.addEventListener('DOMContentLoaded', function () {
  const allButton = document.getElementById('top_category_01');
  if (allButton) {
    allButton.addEventListener('click', () => {
      selectedCategoryId = 0;
      document.querySelector('.food-item.meal').textContent =
        '전체가 선택되었습니다.';
    });
  }

  if (submitButton) {
    submitButton.addEventListener('click', e => {
      e.preventDefault();
      if (isRequestInProgress) return;

      imageContainer.classList.add('spinning');
      sendRequest(selectedCategoryId);

      isRequestInProgress = true;
      submitButton.disabled = true;

      setTimeout(() => {
        imageContainer.classList.remove('spinning');
      }, 3000);
    });
  }
});
