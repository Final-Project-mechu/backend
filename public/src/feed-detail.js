// URL에서 피드 ID 추출
const urlParams = new URLSearchParams(window.location.search);
const feedId = urlParams.get('feedId');

// 서버에서 해당 피드 정보 가져오기
async function getFeedDetail() {
  try {
    const response = await axios.get(`http://localhost:3000/feeds/${feedId}`);
    const feedDetail = response.data;
    const { nick_name } = feedDetail[1];
    const { title, description, image, createdAt } = feedDetail[0];
    const date = formatDate(createdAt);
    document.getElementById('title').textContent = title;
    document.getElementById('nickname').textContent = nick_name;
    const feedimg = document.getElementById('image');
    feedimg.src = image;
    document.getElementById('description').textContent = description;
    document.getElementById('createdAt').textContent = date;
  } catch (error) {
    console.error('피드 정보를 가져오는 중 오류 발생:', error);
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

// 해당 피드에 따른 댓글 전체 조회
async function commentsGet() {
  try {
    const serverCall = await axios.get(
      `http://localhost:3000/comments/${feedId}`,
    );
    const commentList = serverCall.data;
    createAllCommentItems(commentList);
  } catch (err) {
    console.error('commentsGet', err);
  }
}

// 피드 삭제 
function feedDelete() {
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
              <button id="comment-change-${comment.id}">댓글 수정</button>
              <button id="comment-delete-${comment.id}" onclick="deleteComment(${comment.id})">댓글 삭제</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

async function deleteComment(commentId) {
  try {
    await axios.delete(`http://localhost:3000/comments/${commentId}`);
    alert("댓글이 삭제되었습니다.");
    commentsGet(); // 댓글 삭제 후 댓글 목록을 다시 가져옵니다.
  } catch (error) {
    alert("댓글 삭제는 본인만 가능합니다.");
  }
}

// "댓글 생성" 버튼 클릭 이벤트 추가
document.getElementById('commentCreate').addEventListener('click', async function() {
  const commentText = document.getElementById('comment-text').value;

  // 댓글 내용이 비어있지 않은 경우에만 요청을 보냄
  if (commentText) {
      try {
          const response = await axios.post(`http://localhost:3000/comments/${feedId}`, {
              contents: commentText
          });

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
};
