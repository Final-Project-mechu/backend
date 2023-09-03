document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-button');
  const subFilterButtons = document.querySelectorAll('.sub-filter-button');
  const subFilterButtons2 = document.querySelectorAll('.sub-filter-button2');
  const foodItems = document.querySelectorAll('.food-item');
  const mainContent = document.querySelector('main');

  // 처음에는 "식사"와 "디저트"만 노출
  subFilterButtons.forEach(subButton => {
    const subCategory = subButton.getAttribute('category');
    if (
      subCategory === 'korean' ||
      subCategory === 'chinese' ||
      subCategory === 'japanese' ||
      subCategory === 'western' ||
      subCategory === 'indian' ||
      subCategory === 'coffee' ||
      subCategory === 'cake' ||
      subCategory === 'bread' ||
      subCategory === 'tanghulu' ||
      subCategory === 'icecream'
    ) {
      subButton.style.display = 'none';
    } else {
      subButton.style.display = 'none';
    }
  });

  // 처음에는 메인 내용 숨기기
  mainContent.style.display = 'none';

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.getAttribute('category');

      // 선택된 버튼에 "active" 클래스 추가
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');

      // 메인 내용 표시
      mainContent.style.display = 'block';

      foodItems.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      // "식사" 버튼 클릭 시
      if (category === 'meal') {
        subFilterButtons.forEach(subButton => {
          const subCategory = subButton.getAttribute('category');
          if (
            subCategory === 'korean' ||
            subCategory === 'chinese' ||
            subCategory === 'japanese' ||
            subCategory === 'western' ||
            subCategory === 'indian'
          ) {
            subButton.style.display = 'block';
          } else {
            subButton.style.display = 'none';
          }
        });

        const selectedMealText = document.createElement('p');
        selectedMealText.textContent = '식사가 선택되었습니다';
      }
      // "디저트" 버튼 클릭 시
      else if (category === 'dessert') {
        subFilterButtons.forEach(subButton => {
          const subCategory = subButton.getAttribute('category');
          if (
            subCategory === 'coffee' ||
            subCategory === 'cake' ||
            subCategory === 'bread' ||
            subCategory === 'tanghulu'
            // subCategory === 'test' <여기에 디저트의 서브카테고리를 생성>
          ) {
            subButton.style.display = 'block';
          } else {
            subButton.style.display = 'none';
          }
        });
      }
      // 다른 카테고리 버튼 클릭 시
      else {
        subFilterButtons.forEach(subButton => {
          subButton.style.display = 'none';
        });
      }
    });
  });

  subFilterButtons.forEach(subButton => {
    subButton.addEventListener('click', () => {
      const subCategory = subButton.getAttribute('category');

      foodItems.forEach(item => {
        const mainCategory = item.classList.contains('meal')
          ? 'meal'
          : 'dessert';

        if (
          subCategory === 'all' ||
          item.classList.contains(subCategory) ||
          subCategory === mainCategory
        ) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
});

// 버튼을 동적으로 생성하고 이벤트 핸들러를 연결합니다.
const buttonContainer = document.getElementById('button-container');

buttonInfoList.forEach(buttonInfo => {
  const button = document.createElement('button');
  button.id = buttonInfo.id;
  button.className = 'filter-button';
  button.textContent = buttonInfo.label;
  button.setAttribute('data-category', buttonInfo.category);

  // 클릭 이벤트 핸들러를 연결합니다.
  button.addEventListener('click', () => {
    handleButtonClick(buttonInfo.category);
  });

  buttonContainer.appendChild(button); // 여기가 문제라는데 파악이 안 된다..
});

// 클릭 이벤트를 처리하는 함수
function handleButtonClick(category) {
  // 해당 버튼의 ID를 가져옵니다.
  const buttonId = `top_category_${category}`;

  // Axios를 사용하여 POST 요청을 보냅니다.
  axios
    .post('/your-backend-endpoint', {
      category: category, // 선택된 카테고리 정보
      htmlId: buttonId, // 버튼의 ID 정보
    })
    .then(response => {
      // 백엔드에서의 응답 처리
      console.log(response.data);
    })
    .catch(error => {
      // 오류 처리
      console.error(error);
    });
}

