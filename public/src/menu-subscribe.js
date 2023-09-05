let keywordResult;

// Function to send a POST request
function sendRequest(categoryId) {
  axios
    .post('http://localhost:3000/user-actions/random-weighted-foods', {
      category_id: categoryId,
    })
    .then(response => {
      // Display the response on the webpage
      document.querySelector('.food-item.meal').textContent =
        response.data.message;

      const resultDiv = document.getElementById('result3');
      resultDiv.innerHTML = `<h2>${response.data}</h2>`;
      storeBtn.style.display = 'block';
      storeBtn.addEventListener('click', openKakaopage);
      keywordResult = response.data;
      console.log('전역변수 키워드', keywordResult);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('요청 중 오류가 발생했습니다.'); // Display error message to the user
    });
}
