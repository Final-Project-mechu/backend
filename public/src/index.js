let randomData;

/**
 * 사용자의 GPS 정보를 불러오는 함수
 */
navigator.geolocation.getCurrentPosition(
  function (pos) {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;
    createMap(latitude, longitude);
  },
  () => {
    console.log('위치 허용 해라');
  },
);

/**
 * 지도를 만드는 함수
 * @param {*} latitude
 * @param {*} longitude
 */
function createMap(latitude, longitude) {
  searchPlaces(latitude, longitude, (data, status) => {
    if (status === kakao.maps.services.Status.ZERO_RESULT) {
      new Error('검색 결과가 존재하지 않습니다.');
    } else if (status === kakao.maps.services.Status.ERROR) {
      new Error('검색 결과 중 오류가 발생했습니다.');
    }
    successOnGetPlace(data, latitude, longitude);
  });
}

/**
 * 데이터 불러오는 것 성공 시 가져오는 함수
 * @param {*} data : 성공 시 가져오는 데이터(15개정도 됨)
 * @param {*} latitude : 사용자의 GPS정보
 * @param {*} longitude : 사용자의 GPS정보
 */
function successOnGetPlace(data, latitude, longitude) {
  const randomIndex = Math.floor(Math.random() * data.length);
  randomData = data[randomIndex];
  const placeX = randomData.x;
  const placeY = randomData.y;
  const map = getMap(placeY, placeX);
  const markerPosition = new kakao.maps.LatLng(placeY, placeX);
  const marker = new kakao.maps.Marker({
    position: markerPosition,
  });
  const infoContent = `<div style="padding:5px; text-align: center;">${randomData.place_name}<br><a href="${randomData.place_url}" style="color:blue" target="_blank">큰지도보기</a></div>`;
  const infoWindow = new kakao.maps.InfoWindow({
    position: markerPosition,
    content: infoContent,
  });
  marker.setMap(map);
  infoWindow.open(map, marker);
}

/**
 * 주어진 위도,경도를 중심으로 지도를 얻어오는 함수
 * @param {*} latitude
 * @param {*} longitude
 * @returns
 */
function getMap(latitude, longitude) {
  const mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 5, // 지도의 확대 레벨
      radius: 5000,
      // draggable: true,
      // sort: kakao.maps.services.SortBy.DISTANCE,
    };

  return new kakao.maps.Map(mapContainer, mapOption);
}

/**
 * 위도, 경도를 받아 키워드로 검색한 후 받은 데이터를 콜백하는 함수
 * @param {*} latitude 위도
 * @param {*} longitude 경도
 * @param {*} callback 키워드와 위치를 받아 검색 한 후 결과
 */
function searchPlaces(latitude, longitude, callback) {
  let keyword = '치킨';
  let searchOptions = {
    x: longitude,
    y: latitude, // 검색 중심 좌표를 기존 지도의 중심 좌표로 설정
    radius: 5000, // 검색 반경
  };
  // 장소 검색 객체를 생성합니다
  const places = new kakao.maps.services.Places();
  places.keywordSearch(keyword, callback, searchOptions);
}

/**
 * 찜하기 눌렀을 때 사용자의 찜하기 목록생성 함수
 */
function addToFavorite() {
  console.log(randomData);
  // JWT 토큰 가져오기
  const cookies = document.cookie.split(';');
  let jwtToken = null;
  cookies.forEach(cookie => {
    const [key, value] = cookie.split('=');
    if (key.trim() === 'Authentication') {
      jwtToken = value;
    }
  });
  if (randomData) {
    axios({
      url: 'http://localhost:3000/favorites',
      method: 'post',
      data: {
        address_name: randomData.address_name,
        road_address_name: randomData.road_address_name,
        kakao_id: randomData.id,
        category_name: randomData.category_name,
        phone: randomData.phone,
        place_name: randomData.place_name,
        place_url: randomData.place_url,
      },
      headers: {
        Authentication: `${jwtToken}`,
      },
    })
      .then(function (res) {
        console.log(res.result);
        console.log('찜하기 성공');
        alert('찜하기 완료');
      })
      .catch(error => {
        if (error.res && error.res.data) {
          alert('찜하기 실패');
          console.log(error);
        }
      });
  } else {
    console.log('데이터 없음');
  }
}
