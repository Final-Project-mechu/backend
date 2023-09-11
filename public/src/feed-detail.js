// URL에서 피드 ID 추출
const urlParams = new URLSearchParams(window.location.search);
const feedId = urlParams.get('id');

// 서버에서 해당 피드 정보 가져오기
async function getFeedDetail() {
  try {
    const response = await axios.get(`http://localhost:3000/feeds/${feedId}`);
    const feedDetail = response.data;

    // 피드 정보를 화면에 표시
    const feedTitleElement = document.getElementById('feed-title');
    const feedContentElement = document.getElementById('feed-content');
    // 필요한 다른 요소들도 가져와서 표시합니다.

    feedTitleElement.textContent = feedDetail.title;
    feedContentElement.textContent = feedDetail.content;
    // 필요한 다른 정보도 표시합니다.
  } catch (error) {
    console.error('피드 정보를 가져오는 중 오류 발생:', error);
  }
}

// 페이지 로드 시 피드 정보 가져오기
window.onload = getFeedDetail;
