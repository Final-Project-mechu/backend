// Function to send a POST request
function sendRequest(categoryId) {
  axios
    .post('http://localhost:3000/user-actions/random-weighted-foods', {
      category_id: categoryId,
    })
    .then(response => {
      console.log(response.data);

      // Display the response on the webpage
      document.querySelector('.food-item.meal').textContent =
        response.data.message;

      const resultDiv = document.getElementById('result3');
      resultDiv.innerHTML = `<h2>${response.data}</h2>`;
    })
    .catch(error => {
      console.error('Error:', error);
      alert('요청 중 오류가 발생했습니다.'); // Display error message to the user
    });
}

// 전역 변수로 선택된 카테고리 ID를 저장합니다.
let selectedCategoryId = null;

document.addEventListener('DOMContentLoaded', function () {
  // 카테고리 버튼에 대한 이벤트 리스너
  document
    .querySelectorAll('.filter-button, .sub-filter-button')
    .forEach(button => {
      button.addEventListener('click', function () {
        // 버튼의 data-category-id 값을 가져와 selectedCategoryId에 저장합니다.
        selectedCategoryId = parseInt(
          button.getAttribute('data-category-id'),
          10,
        );
        console.log(JSON.stringify({ category_id: selectedCategoryId })); // 선택된 카테고리 ID를 JSON 형태로 콘솔에 출력합니다.
      });
    });

  // sendRequest 버튼에 대한 이벤트 리스너
  document
    .querySelector('.button-container2 .button')
    .addEventListener('click', function () {
      if (selectedCategoryId) {
        sendRequest(selectedCategoryId);
      } else {
        alert('카테고리를 먼저 선택해주세요.');
      }
    });
});
