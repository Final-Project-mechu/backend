let randomDataExtract;
// 마커를 담을 배열입니다
let markers = [];
let latitude;
let longitude;
let places;

// geolocation은 비동기 함수다...
navigator.geolocation.getCurrentPosition(function (pos) {
  latitude = pos.coords.latitude;
  longitude = pos.coords.longitude;
  // 지도 생성 및 검색 수행
  console.log('GPS 실행');
  // createMap();
  createMap2();
});

// async function createMap() {
//   let mapContainer = document.getElementById('map'), // 지도를 표시할 div
//     mapOption = {
//       center: new kakao.maps.LatLng(latitude, longitude),
//       level: 3, // 지도의 확대 레벨
//       radius: 5000,
//       draggable: true,
//       sort: kakao.maps.services.SortBy.DISTANCE,
//     };

//   // 지도를 생성합니다
//   map = new kakao.maps.Map(mapContainer, mapOption);
//   const zoomControl = new kakao.maps.ZoomControl();
//   map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

//   // 1) 키워드로 검색한 장소 결과 데이터
//   const searchResult = await searchPlaces();
//   console.log('서치플레이스 함수 실행 후 맵 함수', searchResult);
//   // 2) 1)을 토대로 마커 생성
//   const placeX = searchResult[0].x;
//   const placeY = searchResult[0].y;
//   console.log('결과값', placeX);
//   const markerPosition = new kakao.maps.LatLng(placeX, placeY);
//   let marker = new kakao.maps.Marker({
//     position: markerPosition,
//   });
//   console.log('맵', map);
//   console.log('마커', marker);
//   marker.setMap(map);
// }

async function createMap2() {
  // 1) 키워드로 검색한 장소 결과 데이터

  //   console.log('서치플레이스 함수 실행 후 맵 함수', searchResult);
  //   // 2) 1)을 토대로 마커 생성
  const searchResult = await searchPlaces();
  const placeX = searchResult[0].x;
  const placeY = searchResult[0].y;
  let mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 5, // 지도의 확대 레벨
      radius: 5000,
      // draggable: true,
      // sort: kakao.maps.services.SortBy.DISTANCE,
    };

  let map = new kakao.maps.Map(mapContainer, mapOption);
  console.log('맵확인', map);

  console.log('=======x좌표', placeX);
  console.log('=======y좌표', placeY);
  let markerPosition = new kakao.maps.LatLng(latitude, longitude);
  let marker = new kakao.maps.Marker({
    position: markerPosition,
  });
  marker.setMap(map);
  console.log('======마커달린 맵', map);
  console.log('======', markerPosition);
  console.log('======마커', marker);
}

// 키워드 검색을 요청하는 함수입니다
async function searchPlaces() {
  let keyword = '치킨';
  let searchOptions = {
    x: longitude,
    y: latitude, // 검색 중심 좌표를 기존 지도의 중심 좌표로 설정
    radius: 5000, // 검색 반경
  };
  // 장소 검색 객체를 생성합니다
  places = new kakao.maps.services.Places();
  return new Promise((resolve, reject) => {
    places.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          const randomData = [data[randomIndex]];
          randomDataExtract = data[randomIndex];
          console.log('콜백함수 placesSearchCB', randomData);
          resolve(randomData);
        } else {
          reject(new Error('검색 결과가 존재하지 않습니다.'));
        }
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        reject(new Error('검색 결과가 존재하지 않습니다.'));
      } else if (status === kakao.maps.services.Status.ERROR) {
        reject(new Error('검색 결과 중 오류가 발생했습니다.'));
      }
    });
  });

  // const result = await places.keywordSearch(
  //   keyword,
  //   placesSearchCB,
  //   searchOptions,
  // );
  // console.log('키워드 요청 함수', result);
  // return result;
}
// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
// async function placesSearchCB(data, status) {
//   if (status === kakao.maps.services.Status.OK) {
//     if (data.length > 0) {
//       // 정상적으로 검색이 완료됐으면
//       // 검색 목록과 마커를 표출합니다
//       const randomIndex = Math.floor(Math.random() * data.length);
//       const randomData = [data[randomIndex]];
//       randomDataExtract = data[randomIndex];
//       console.log('콜백함수 placesSearchCB', randomData);
//       return randomData;
//     }
//   } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
//     alert('검색 결과가 존재하지 않습니다.');
//     return;
//   } else if (status === kakao.maps.services.Status.ERROR) {
//     alert('검색 결과 중 오류가 발생했습니다.');
//     return;
//   }
// }

// 검색 결과를 마커로 표출하는 함수
// async function displayPlaces() {
//   // console.log('마커표출함수', result);
//   // const place_x = result[0].x;
//   // const place_y = result[0].y;
//   const place_x = 126.863298876003;
//   const place_y = 37.2951825704786;
//   let markerPosition = new kakao.maps.LatLng(place_x, place_y);
//   let marker = new kakao.maps.Marker({
//     position: markerPosition,
//   });
//   marker.setMap(map);
//   console.log('마커표출함수', map);
// }

// 찜하기 누르면 데이터를 보내는 함수
document.getElementById('favoriteButton').onclick = function () {
  if (('찜하기', randomDataExtract)) {
    console.log('axios', randomDataExtract);
    console.log('카카오id 확인하기', randomDataExtract.id);
    // 여기서부터 axios함수와 서버 데이터를 합치면 된다.
    axios({
      url: 'http://localhost:3000/favorites',
      method: 'post',
      data: {
        address_name: randomDataExtract.address_name,
        road_address_name: randomDataExtract.road_address_name,
        id: randomDataExtract.id,
        category_name: randomDataExtract.category_name,
        phone: randomDataExtract.phone,
        place_name: randomDataExtract.place_name,
        place_url: randomDataExtract.place_url,
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
};
