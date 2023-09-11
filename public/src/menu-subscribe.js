let selectedCategoryId = 0; 
let keywordResult;
let isRequestInProgress = false;

const storeBtn = document.getElementById('storeBtn'); 
const submitButton = document.querySelector('.button[type="submit"]');
const imageContainer = document.querySelector('.image-container img');

function openKakaopage(data) {
  // 여기에 카카오 오픈 API 들어가면 됩니다.
  console.log(data);
}

function displayCategoryResponse(response) {
  setTimeout(() => {
    document.querySelector('.food-item.meal').textContent = response.data.message;
    const resultDiv = document.getElementById('result3');
    resultDiv.innerHTML = `<h2>${response.data}</h2>`;
    storeBtn.style.display = 'block';
    keywordResult = response.data;
    storeBtn.addEventListener('click', () => openKakaopage(keywordResult));
    isRequestInProgress = false;
    submitButton.disabled = false;
  }, 3000);
}

function sendRequest(categoryId) {
  console.log('Sending request for category:', categoryId);
  axios.post('http://localhost:3000/user-actions/random-weighted-foods', {
    category_id: categoryId,
  })
  .then(displayCategoryResponse)
  .catch(error => {
    console.error('Error:', error);
    alert('요청 중 오류가 발생했습니다.');
  });
}

function createCategoryButtons(categories) {
  const filterButtonsDiv = document.querySelector('.filter-buttons');
  categories.forEach(category => {
    const button = document.createElement('button');
    button.id = `category_${category.id}`;
    button.className = 'filter-button';
    button.textContent = category.category_name;
    button.addEventListener('click', () => {
      document.querySelector('.food-item.meal').textContent = `${category.category_name}가 선택되었습니다.`;
      selectedCategoryId = category.id;
    });
    filterButtonsDiv.appendChild(button);
  });
}

axios.get('http://localhost:3000/category')
  .then(response => createCategoryButtons(response.data))
  .catch(error => {
    console.error('Error:', error);
    alert('요청 중 오류가 발생했습니다.');
  });

document.addEventListener('DOMContentLoaded', function () {
  const allButton = document.getElementById('top_category_01');
  if (allButton) {
    allButton.addEventListener('click', () => {
      selectedCategoryId = 0;
      document.querySelector('.food-item.meal').textContent = '전체가 선택되었습니다.';
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
