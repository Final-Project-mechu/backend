// 피드 쓰기 눌렀을 때 나오는 함수
function writeClick() {
  let cookies = document.cookie;
  if (!cookies.includes('AccessToken', 'RefreshToken')) {
    return alert('로그인이 필요한 기능입니다!');
  } else {
    location.href = 'http://localhost:3000/feed-create.html';
  }
}

async function feedsGet() {
  const callServer = await axios({
    method: 'get',
    url: 'http://localhost:3000/feeds',
  });
  const allFeeds = callServer.data;
  createAllFeedsItems(allFeeds);
}

function formatDate(data) {
  const getData = new Date(data);
  const year = getData.getFullYear();
  const month = getData.getMonth();
  const day = getData.getDay();

  const outputDate = ' ' + month + '월 ' + day + '일 ' + ' , ' + year;
  return outputDate;
}

function createAllFeedsItems(feeds) {
  const feedsContainer = document.getElementById('feeds-container');
  feedsContainer.innerHTML = '';

  feeds.forEach(feed => {
    const outputDate = formatDate(feed.createdAt);
    feedsContainer.innerHTML += `<div class="col-lg-4 col-md-4 col-sm-6">
                                    <div class="blog__item">
                                        <div class="blog__item__pic">
                                        <img src="${feed.image}" href="feed-detail.html?feedId='${feed.id}" alt="https://final-bucket-ksr.s3.ap-northeast-2.amazonaws.com/ce8af23a-e098-4b43-9319-da360116361d-1694416218106.jpg" />
                                        </div>
                                        <div class="blog__item__text">
                                        <h5><a href="feed-detail.html?feedId=${feed.id}">${feed.title}</a></h5>
                                        <ul>
                                            
                                        </div>
                                    </div>
                                </div>
                                `;
  });
}
feedsGet();
