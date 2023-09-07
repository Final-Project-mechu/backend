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
    const userData = ['항목1', '항목2', '항목3'];

    const userDataHtml = userData
      .map(
        item =>
          `<li><input type="checkbox" class="item-checkbox" name="test" value="test1">${item}</li>`,
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

    newWindow.document
      .getElementById('selectItemsBtn')
      .addEventListener('click', function () {
        const selectedItems = [];
        const checkboxes =
          newWindow.document.querySelectorAll('.item-checkbox');

        checkboxes.forEach(checkbox => {
          if (checkbox.checked) {
            selectedItems.push(
              checkbox.nextSibling
                ? checkbox.nextSibling.textContent.trim()
                : '체크테스트',
            );
          }
        });

        const parentWindow = window.opener;
        if (parentWindow) {
          const favoriteInput =
            parentWindow.document.getElementById('favoriteid');
          if (favoriteInput) {
            favoriteInput.value = selectedItems.join(', ');
          }
        }
        newWindow.close();
      });
  });

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
