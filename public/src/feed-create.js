const writeButton = document.getElementById('writeBtn');
writeButton.addEventListener('click', feedCreate);

const cancelButton = document.getElementById('cancelBtn');
cancelButton.addEventListener('click', redirectToFeedPage);

document
  .getElementById('openNewWindowBtn')
  .addEventListener('click', function () {
    // 새 창을 열고 보여줄 콘텐츠를 설정합니다.
    const userData = ['항목 1', '항목 2', '항목 3']; // 사용자가 담았던 항목 데이터

    // 사용자가 담았던 항목을 HTML 문자열로 만듭니다.
    const userDataHtml = userData.map(item => `<li>${item}</li>`).join('');

    // 새 창을 열고 HTML 콘텐츠를 설정합니다.
    const newWindow = window.open('', 'userDataWindow', 'width=400,height=300');
    newWindow.document.body.innerHTML = `
      <h2>담았던 항목 목록</h2>
      <ul>${userDataHtml}</ul>
    `;
  });

function redirectToFeedPage() {
  console.log('버튼 클릭');
  location.replace('feed.html');
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
