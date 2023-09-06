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
      keywordResult = response.data;
      storeBtn.addEventListener('click', openKakaopage(keywordResult));
    })
    .catch(error => {
      console.error('Error:', error);
      alert('요청 중 오류가 발생했습니다.');
    });
}