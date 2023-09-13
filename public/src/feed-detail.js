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

document.getElementById('feed-change').addEventListener('click', () => {
  const modal = document.getElementById('myModal');

  // 모달 내용 엘리먼트 가져오기
  const modalFeedTitle = document.getElementById('title');
  const modalFeedContent = document.getElementById('description');

  document.getElementById('modal-save').addEventListener('click', () => {
    // 수정된 피드 제목과 내용 가져오기
    const updatedFeedTitle = modalFeedTitle.value;
    const updatedFeedContent = modalFeedContent.value;

    // 수정된 내용을 서버에 전송하도록 feedModify 함수 호출
    feedModify(updatedFeedTitle, updatedFeedContent);

    // 모달을 닫음
    modal.style.display = 'none';
  });

  modal.style.display = 'block';

  document.getElementById('modal-close').addEventListener('click', () => {
    modal.style.display = 'none';
  });
});

async function feedModify(updatedTitle, updatedContent) {
  const data = {
    title: updatedTitle,
    description: updatedContent,
  };
  axios
    .patch(`http://localhost:3000/feeds/${feedId}`, data)
    .then(response => {
      alert('피드 수정 성공');
    })
    .catch(error => {
      if (error.response) {
        const errorMessage = error.response.data.message;
        alert('피드 수정 실패: ' + errorMessage + '');
      } else {
        console.error('네트워크 오류', error.message);
        alert('네트워크 오류가 발생했습니다.');
      }
    });
}

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

async function commentsGet() {
  try {
    const serverCall = await axios.get(
      `http://localhost:3000/comments/${feedId}`,
    );
    const commentList = serverCall.data;
    createAllCommentItems(commentList);
  } catch (err) {
    console.err('commentsGet', err);
  }
}

function createAllCommentItems(comments) {
  const commentContainer = document.getElementById('comment-box');
  commentContainer.innerHTML = '';

  comments.forEach(comment => {
    const outputDate = formatDate(comment.createdAt);
    commentContainer.innerHTML += `<div class="comment">
                                      <div class="comment-info">
                                        <h6 class="nickname">${comment.nick_name}</h6>
                                        <h6 class="comment-content">${comment.contents}</p>
                                        <h6 class="createdAt">${outputDate}</h6>
                                      </div>
                                    </div>
                                  `;
  });
}

window.onload = function () {
  getFeedDetail();
  commentsGet();
};
