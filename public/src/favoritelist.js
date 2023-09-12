// favoritelist.js

// 페이지 로드 시 찜목록 가져오기
document.addEventListener('DOMContentLoaded', function () {
  axios
    .get('http://localhost:3000/favorites')
    .then(response => {
      const favorites = response.data;
      const contentWrapper = document.querySelector('.content-wrapper');

      // 기존 찜목록 삭제
      contentWrapper.innerHTML = '';

      // API 응답을 기반으로 찜목록 동적 생성
      favorites.forEach(favorite => {
        const restaurantDiv = document.createElement('div');
        restaurantDiv.classList.add('restaurant');
        restaurantDiv.setAttribute('data-id', favorite.id); // data-id 속성 추가

        const restaurantCheckbox = document.createElement('input');
        restaurantCheckbox.type = 'checkbox';
        restaurantCheckbox.classList.add('restaurant-checkbox');

        const restaurantName = document.createElement('h3');
        restaurantName.classList.add('restaurant-name', 'display-5');
        restaurantName.textContent = favorite.place_name;

        const ul = document.createElement('ul');
        ul.classList.add('list-group');

        const li1 = document.createElement('li');
        li1.classList.add('list-group-item');
        li1.innerHTML = `음식점 URL: <a href="${favorite.place_url}">${favorite.place_url}</a>`;

        const li2 = document.createElement('li');
        li2.classList.add('list-group-item');
        li2.textContent = `음식점 카테고리: ${favorite.category_name}`;

        const li3 = document.createElement('li');
        li3.classList.add('list-group-item');
        li3.textContent = `음식점 위치: ${favorite.address_name}`;

        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);

        restaurantDiv.appendChild(restaurantCheckbox);
        restaurantDiv.appendChild(restaurantName);
        restaurantDiv.appendChild(ul);

        contentWrapper.appendChild(restaurantDiv);
      });
    })
    .catch(error => {
      // 서버에서 발생한 예외 처리
      if (error.response) {
        // 서버가 응답을 보낸 경우
        const errorMessage = error.response.data.message;
        alert('회원가입 실패: ' + errorMessage);
      } else {
        // 서버로 요청을 보내는 동안 네트워크 오류 등의 문제가 발생한 경우
        console.error('네트워크 오류:', error.message);
        alert('네트워크 오류가 발생했습니다.');
      }
    });
});

// 체크된 체크 박스의 id 값을 배열에 저장
document.querySelectorAll('.restaurant-checkbox:checked').forEach(checkbox => {
  const restaurantDiv = checkbox.closest('.restaurant');
  const id = parseInt(restaurantDiv.getAttribute('data-id'), 10); // 각 음식점 div에 data-id 속성을 추가해야 합니다.
  if (!isNaN(id)) {
    // 유효한 숫자인지 확인
    checkedIds.push(id);
  }
});

// 페이지 로드 시 사용자 이름 가져오기
document.addEventListener('DOMContentLoaded', function () {
  axios
    .get('http://localhost:3000/users/find')
    .then(response => {
      const userName = response.data;
      const favoriteNameElement = document.querySelector('.favorite-name');
      favoriteNameElement.textContent = `${userName}님의 찜목록`;
    })
    .catch(error => {
      // 서버에서 발생한 예외 처리
      if (error.response) {
        // 서버가 응답을 보낸 경우
        const errorMessage = error.response.data.message;
        alert('회원가입 실패: ' + errorMessage);
      } else {
        // 서버로 요청을 보내는 동안 네트워크 오류 등의 문제가 발생한 경우
        console.error('네트워크 오류:', error.message);
        alert('네트워크 오류가 발생했습니다.');
      }
    });
});

// "삭제하기" 버튼 클릭 이벤트
document.querySelector('.delete-btn').addEventListener('click', function () {
  // 체크된 체크 박스의 id 값을 저장할 배열
  const checkedIds = [];

  // 체크된 체크 박스의 id 값을 배열에 저장
  document
    .querySelectorAll('.restaurant-checkbox:checked')
    .forEach(checkbox => {
      const restaurantDiv = checkbox.closest('.restaurant');
      const id = restaurantDiv.getAttribute('data-id'); // 각 음식점 div에 data-id 속성을 추가해야 합니다.
      checkedIds.push(id);
    });

  // 체크된 항목이 없으면 삭제하지 않음
  if (checkedIds.length === 0) {
    alert('삭제할 항목을 선택하세요.');
    return;
  }

  // 체크된 항목을 순회하며 DELETE 요청 보내기
  checkedIds.forEach(id => {
    axios
      .delete(`http://localhost:3000/favorites/${id}`)
      .then(response => {
        console.log('삭제 성공:', response.data);
        // 페이지 새로고침 또는 해당 항목 삭제
        location.reload();
      })
      .catch(error => {
        // 서버에서 발생한 예외 처리
        if (error.response) {
          // 서버가 응답을 보낸 경우
          const errorMessage = error.response.data.message;
          alert('회원가입 실패: ' + errorMessage);
        } else {
          // 서버로 요청을 보내는 동안 네트워크 오류 등의 문제가 발생한 경우
          console.error('네트워크 오류:', error.message);
          alert('네트워크 오류가 발생했습니다.');
        }
      });
  });
});
