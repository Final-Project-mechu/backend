/**
 * 처음 write버튼 클릭 시 로그인 안하면 feed 페이지로 돌려보내는 함수
 */
window.onload = function () {
  let cookies = document.cookie;
  if (!cookies.includes('AccessToken=Bearer%20')) {
    alert('로그인이 필요한 기능입니다!');
    window.location.href = 'https://togethereat.shop/feed.html';
  }
};

/**
 * 취소 버튼 클릭 시 feed 페이지로 돌려보내는 함수
 */
const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', redirectToFeedPage);
function redirectToFeedPage() {
  window.location.href = 'feed.html';
}

/**
 * 담았던 상점보기 클릭 시 열리는 창 정보를 가져오는 함수
 */
document
  .getElementById('openNewWindowBtn')
  .addEventListener('click', async function () {
    const userFavorites = await findFavorites();
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

    handleSelectItems(newWindow);
  });

/**
 * 새 창에서 선택하기 클릭 시 input에 담기는 함수
 * @param {*} newWindow
 */
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
      favoriteidInput.value = selectedItems.join(',');
      newWindow.close();
    });
}

/**
 * form데이터 방식으로 정보들을 보내는 함수
 */
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
      url: 'https://togethereat.shop/feeds',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (res) {
        alert('찜한 상점의 피드가 생성되었습니다!');
        location.href = 'https://togethereat.shop/feed.html';
      })
      .catch(err => {
        alert(err.response.data.message);
      });
  } else if (!favorites) {
    axios({
      method: 'post',
      url: 'https://togethereat.shop/feeds/common',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (res) {
        alert('피드가 생성되었습니다!');
        location.href = 'https://togethereat.shop/feed.html';
      })
      .catch(err => {
        alert(err.response.data.message);
      });
  }
}

/**
 * 유저가 찜한 목록을 전달
 * @returns 유저가 선택했던 상점들
 */
async function findFavorites() {
  const callServer = await axios({
    method: 'get',
    url: 'https://togethereat.shop/favorites',
  });
  const allFavorites = callServer.data;
  console.log(allFavorites);
  return allFavorites;
}
