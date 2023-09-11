window.onload = function () {
  let cookies = document.cookie;
  if (!cookies.includes('Authentication=Bearer%20')) {
    alert('로그인이 필요한 기능입니다!');
    window.location.href = 'http://localhost:3000/feed.html';
  }
};

const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', redirectToFeedPage);
function redirectToFeedPage() {
  window.location.href = 'feed.html';
}

document
  .getElementById('openNewWindowBtn')
  .addEventListener('click', async function () {
    const userFavorites = await findFavorites();
    console.log(userFavorites);
    const userDataHtml = userFavorites
      .map(
        item =>
          `<li><input type="checkbox" class="item-checkbox" value="${item.id}">${item.place_name}</li>`,
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
      newWindow.close();
    });
}

function feedCreate() {
  const titleInput = document.getElementById('feedtitle').value;
  const favorites = document.getElementById('favoriteid').value;
  const descriptionInput = document.getElementById('description').value;
  const imgFile = document.getElementById('menuImage').files[0];

  const formData = new FormData();
  formData.append('title', titleInput);
  formData.append('description', descriptionInput);
  formData.append('file', imgFile);

  if (favorites) {
    formData.append('favorite_ids', favorites);
    console.log(formData);
    console.log('페이보릿', favorites);
    axios({
      method: 'post',
      url: 'http://localhost:3000/feeds',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (res) {
        alert('찜한 상점의 피드가 생성되었습니다!');
        location.href = 'http://localhost:3000/feed.html';
      })
      .catch(err => {
        alert(err.response.data.message);
      });
  } else if (!favorites) {
    axios({
      method: 'post',
      url: 'http://localhost:3000/feeds/common',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (res) {
        alert('피드가 생성되었습니다!');
        location.href = 'http://localhost:3000/feed.html';
      })
      .catch(err => {
        alert(err.response.data.message);
      });
  }
}

async function findFavorites() {
  const callServer = await axios({
    method: 'get',
    url: 'http://localhost:3000/favorites',
  });
  const allFavorites = callServer.data;
  console.log(allFavorites);
  return allFavorites;
}
