// 피드 조회 함수

async function feedsGet() {
  const callServer = await axios({
    method: 'get',
    url: 'http://localhost:3000/feeds',
  });
  const allFeeds = callServer.data;
  console.log(allFeeds);
  createAllFeedsItems(allFeeds);
}

function createAllFeedsItems(feeds) {
  const feedsContainer = document.getElementById('feeds-container');
  feedsContainer.innerHTML = '';

  feeds.forEach(feed => {
    feedsContainer.innerHTML += `<div class="col-lg-4 col-md-4 col-sm-6" >
                                    <div class="blog__item">
                                        <div class="blog__item__pic">
                                        <img src="img/blog/blog-1.jpg" alt="" />
                                        </div>
                                        <div class="blog__item__text">
                                        <h5><a href="feed-detail.html">${feed.title}</a></h5>
                                        <ul>
                                            <li><i class="fa fa-calendar-o"></i> May 4,2019</li>
                                            <li><i class="fa fa-comment-o"></i> 5</li>
                                        </ul>
                                        </div>
                                    </div>
                                </div>
                                `;
  });
}
feedsGet();
