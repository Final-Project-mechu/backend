window.onload = function () {
  let cookies = document.cookie;
  if (!cookies.includes('Authentication=Bearer%20')) {
    alert('로그인이 필요한 기능입니다!');
    window.location.href = 'http://localhost:3000/feed.html';
  }
};

const writeButton = document.getElementById('writeBtn');
writeButton.addEventListener('click', feedCreate);

const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', redirectToFeedPage);
function redirectToFeedPage() {
  window.location.href = 'feed.html';
}

document
  .getElementById('openNewWindowBtn')
  .addEventListener('click', function () {
    const userData = ['항목1', '항목2', '항목3', '항목4', '항목5', '항목6'];

    const userDataHtml = userData
      .map(
        item =>
          `<li><input type="checkbox" class="item-checkbox" value="${item}">${item}</li>`,
      )
      .join('');

    const newWindow = window.open('', 'userDataWindow', 'width=400,height=300');
    newWindow.document.body.innerHTML = `
      <h2>담았던 항목 목록</h2>
      <ul>
      ${userDataHtml}
      </ul>
      <button id="selectItemsBtn">선택하기</button>
    `;

    // 두 번째 함수 호출
    handleSelectItems(newWindow);
  });

function handleSelectItems(newWindow) {
  newWindow.document
    .getElementById('selectItemsBtn')
    .addEventListener('click', function () {
      const checkboxes = newWindow.document.querySelectorAll('.item-checkbox');
      const selectedItems = [];

      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          selectedItems.push(checkbox.value);
        }
      });

      const favoriteidInput = document.getElementById('favoriteid');
      favoriteidInput.value = selectedItems.join(', '); // 선택한 항목들을 쉼표로 구분하여 인풋 필드에 표시
    });
}

function feedCreate() {
  const titleInput = document.getElementById('feedtitle').value;
  const favorites = document.getElementById('favoriteid').value;
  //   const imgFile = document.getElementById('menuImg').files[0];
  const descriptionInput = document.getElementById('description').value;

  axios({
    method: 'post',
    url: 'http://localhost:3000/feeds',
    data: {
      favorite_id: favorites,
      title: titleInput,
      description: descriptionInput,
    },
  })
    .then(function (res) {
      console.log(res);
      console.log('서버에 feed 생성하기 성공!');
    })
    .catch(error => {
      console.log(error);
    });
}
