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
                                        <h6 class="nickname">닉네임 ${comment.nick_name}</h6>
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