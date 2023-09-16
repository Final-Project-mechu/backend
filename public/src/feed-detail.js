// URL에서 피드 ID 추출
const urlParams = new URLSearchParams(window.location.search);
const feedId = urlParams.get('feedId');

// 유저가 쿠키를 갖고있는지 확인하는 함수
async function confirmUser() {
  if (!document.cookie.includes('AccessToken', 'RefreshToken')) {
    blankHeart.style.display = 'inline-block';
    fullHeart.style.display = 'none';
    return false;
  } else {
    return true;
  }
}
// 피드 상세 정보 가져오기
async function getFeedDetail() {
  try {
    const feedRes = await axios.get(`http://localhost:3000/feeds/${feedId}`);
    const feedDetail = feedRes.data;
    console.log(feedDetail);
    const { nick_name } = feedDetail[1];
    const { title, description, image, createdAt } = feedDetail[0];
    const { count } = feedDetail[2];
    const date = formatDate(createdAt);
    document.getElementById('title').textContent = title;
    document.getElementById('nickname').textContent = nick_name;
    const feedimg = document.getElementById('image');
    feedimg.src = image;
    document.getElementById('description').textContent = description;
    document.getElementById('createdAt').textContent = date;
    document.getElementById('likeCount').textContent = count;
  } catch (error) {
    console.error('피드 정보를 가져오는 중 오류 발생:', error);
    alert('해당 피드를 가져오지 못하였습니다.');
  }
}
// 피드 유저가 좋아요 눌렀는지 확인
async function getUserLike() {
  const blankHeart = document.getElementById('blankHeart');
  const fullHeart = document.getElementById('fullHeart');
  const confirmedUser = confirmUser();
  if (confirmedUser === false) {
    blankHeart.style.display = 'inline-block';
    fullHeart.style.display = 'none';
    return;
  } else {
    const feedUserLike = await axios.get(
      `http://localhost:3000/feeds/${feedId}/like/user`,
    );
    if (feedUserLike.data == true) {
      blankHeart.style.display = 'none';
      fullHeart.style.display = 'inline-block';
    } else if (feedUserLike.data == false) {
      blankHeart.style.display = 'inline-block';
      fullHeart.style.display = 'none';
    }
  }
}

function formatDate(data) {
  const getData = new Date(data);
  const year = getData.getFullYear();
  const month = getData.getMonth();
  const day = getData.getDay();
  const hour = getData.getHours();
  const min = getData.getMinutes();

  const outputDate =
    ' ' + year + ' , ' + month + '월 ' + day + '일 ' + hour + '시' + min + '분';
  return outputDate;
}

// 피드 수정
async function feedUpdate() {
  const confirmedUser = confirmUser();
  if (confirmedUser === false) {
    alert('로그인이 필요한 기능입니다');
    return;
  }
  const titleUpdate = document.getElementById('titleUpdate').value;
  const descUpdate = document.getElementById('descUpdate').value;
  const imgUpdate = document.getElementById('imgUpdate').files[0];
  const formData = new FormData();
  formData.append('title', titleUpdate);
  formData.append('description', descUpdate);
  formData.append('file', imgUpdate);
  axios({
    method: 'patch',
    url: `http://localhost:3000/feeds/${feedId}`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(function (res) {
      alert('해당 피드가 수정되었습니다!');
      location.reload();
    })
    .catch(err => {
      console.log(err.response);
      alert(err.response.data.message);
    });
}

// 피드 삭제
function feedDelete() {
  const confirmedUser = confirmUser();
  if (confirmedUser === false) {
    alert('로그인이 필요한 기능입니다');
    return;
  }
  const confirmDelete = confirm('정말 삭제하시겠습니까?');
  if (confirmDelete) {
    axios
      .delete(`http://localhost:3000/feeds/${feedId}`)
      .then(response => {
        alert('피드 삭제 성공!');
        location.href = 'http://localhost:3000/feed.html';
      })
      .catch(error => {
        // 서버에서 발생한 예외 처리
        if (error.response) {
          // 서버가 응답을 보낸 경우
          const errorMessage = error.response.data.message;
          alert('피드 삭제 실패: ' + errorMessage);
        } else {
          // 서버로 요청을 보내는 동안 네트워크 오류 등의 문제가 발생한 경우
          console.error('네트워크 오류:', error.message);
          alert('네트워크 오류가 발생했습니다.');
        }
      });
  }
}

// 피드 좋아요
async function feedLike() {
  const blankHeart = document.getElementById('blankHeart');
  const fullHeart = document.getElementById('fullHeart');
  const confirmedUser = await confirmUser();
  if (confirmedUser === false) {
    alert('로그인이 필요한 기능입니다');
    return;
  }
  try {
    const serverCall = await axios.post(
      `http://localhost:3000/feeds/${feedId}/like`,
    );
    if (serverCall.status === 201) {
      blankHeart.style.display = 'none';
      fullHeart.style.display = 'inline-block';
      getFeedDetail();
    }
  } catch (err) {
    console.log(err);
    alert('좋아요 실패');
  }
}

// 피드 좋아요 취소
async function feedLikeCancel() {
  const blankHeart = document.getElementById('blankHeart');
  const fullHeart = document.getElementById('fullHeart');
  try {
    const serverCall = await axios.delete(
      `http://localhost:3000/${feedId}/like`,
    );
    console.log(serverCall);
    if (serverCall.data.message == '좋아요 취소') {
      blankHeart.style.display = 'inline-block';
      fullHeart.style.display = 'none';
      getFeedDetail();
    }
  } catch {
    console.log(err);
    alert('좋아요 실패');
  }
}

// 해당 피드에 따른 댓글 전체 조회
async function commentsGet() {
  try {
    const serverCall = await axios.get(`http://localhost:3000/comments/${feedId}`);
    const commentList = serverCall.data;
    createAllCommentItems(commentList);
  } catch (err) {
    console.error('commentsGet', err);
  }
}

// 댓글 조회 부분
function createAllCommentItems(comments) {
  const commentContainer = document.getElementById('comment-box');
  commentContainer.innerHTML = '';

  comments.forEach(comment => {
    commentContainer.innerHTML += `
      <div class="comment">
        <div class="comment-info">
          <h6 class="nickname">${comment.nick_name}</h6>
          <h6 class="comment-content">${comment.contents}</h6>
          
          <!-- 세로 점 세 개 메뉴 아이콘 -->
          <div class="menu-icon">
            &#8942; <!-- 세로 점 세 개의 HTML 엔터티 코드 -->
            <!-- 드롭다운 메뉴 -->
            <div class="dropdown-menu">
              <button id="comment-delete-${comment.id}" onclick="deleteComment(${comment.id})">댓글 삭제</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}
{
  /* <button id="comment-change-${comment.id}">댓글 수정</button> */
}

async function deleteComment(commentId) {
  try {
    await axios.delete(`http://localhost:3000/comments/${commentId}`);
    alert('댓글이 삭제되었습니다.');
    commentsGet(); // 댓글 삭제 후 댓글 목록을 다시 가져옵니다.
  } catch (error) {
    alert('댓글 삭제는 본인만 가능합니다.');
  }
}

// 엔터키로 댓글 생성
document
  .getElementById('comment-text')
  .addEventListener('keydown', async function (event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      // shift 키와 함께 엔터키를 누르는 경우를 제외
      event.preventDefault(); // 기본 엔터키 동작(새 줄 추가)을 막습니다.

      const commentText = this.value;

      if (commentText) {
        try {
          const response = await axios.post(
            `http://localhost:3000/comments/${feedId}`,
            {
              contents: commentText,
            },
          );

          if (response.status === 201) {
            commentsGet();
            this.value = '';
            alert('댓글 작성 완료');
          } else {
            console.error('댓글 생성 실패:', response.statusText);
          }
        } catch (error) {
          console.error('댓글 생성 중 오류 발생:', error);
        }
      } else {
        alert('댓글 내용을 입력해주세요.');
      }
    }
  });

// "댓글 생성" 버튼 클릭 이벤트 추가
document
  .getElementById('commentCreate')
  .addEventListener('click', async function () {
    const commentText = document.getElementById('comment-text').value;

    if (commentText) {
      try {
        const response = await axios.post(
          `http://localhost:3000/comments/${feedId}`,
          {
            contents: commentText,
          },
        );

        if (response.status === 201) {
          commentsGet();
          document.getElementById('comment-text').value = '';
          alert('댓글 작성 완료');
        } else {
          console.error('댓글 생성 실패:', response.statusText);
        }
      } catch (error) {
        console.error('댓글 생성 중 오류 발생:', error);
      }
    } else {
      alert('댓글 내용을 입력해주세요.');
    }
  });

window.onload = function () {
  commentsGet();
  getFeedDetail();
  getUserLike();
};
