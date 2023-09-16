document.addEventListener('DOMContentLoaded', () => {
  buttons(); // 페이지 로드 시 버튼 상태 확인
});

/**
 * 버튼 상태 변경 함수
 */
function buttons() {
  const storeBtn = document.getElementById('storeBtn');
  storeBtn.style.display = 'none';
}

// 전역 변수로 선택된 카테고리 ID를 저장합니다.
let selectedCategoryId = null;

document.addEventListener('DOMContentLoaded', function () {
  // 카테고리 버튼에 대한 이벤트 리스너
  document
    .querySelectorAll('.filter-button, .sub-filter-button')
    .forEach(button => {
      button.addEventListener('click', function () {
        // 버튼의 data-category-id 값을 가져와 selectedCategoryId에 저장합니다.
        selectedCategoryId = parseInt(
          button.getAttribute('data-category-id'),
          10,
        );
      });
    });

  // sendRequest 버튼에 대한 이벤트 리스너
  document
    .querySelector('.button-container2 .button')
    .addEventListener('click', function () {
      if (selectedCategoryId) {
        sendRequest(selectedCategoryId);
      } else {
        alert('카테고리를 먼저 선택해주세요.');
      }
    });
});