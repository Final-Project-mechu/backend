// 페이지가 로드될 때 한 번만 새로고침하기 위한 로직
if (!window.location.hash) {
  window.location = window.location + '#loaded';
  window.location.reload();
}



//관리자버튼 display 판별
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await axios.get('http://localhost:3000/users/findAdmin');
    console.log(response.data);
    if (response.status === 200) {
      const userType = response.data;
      if (userType === 1) {
        // 관리자인 경우 버튼을 표시
        document.getElementById('adminButton').style.display = 'block';
      } else {
        // 일반 회원인 경우 버튼을 숨김
        document.getElementById('adminButton').style.display = 'none';
      }
    } else {
      console.error('서버 응답 오류:', response.status);
    }
  } catch (error) {
    console.error('닉네임을 가져오는 중 오류 발생:', error);
  }
});

//카테고리 불러오기
async function categoryGet() {
  const callCategoryServer = await axios({
    method: 'get',
    url: 'http://localhost:3000/category',
  });
  const allCategory = callCategoryServer.data;
  console.log(allCategory);
  createAllCategoryItems(allCategory);
}
function createAllCategoryItems(categorys) {
  const categorysContainer = document.getElementById('category-container');
  categorysContainer.innerHTML = '';
  categorys.forEach(category => {
    categorysContainer.innerHTML += `<li class="active" data-filter=".food${category.id}">${category.category_name}</li>`;
  });
}
categoryGet();

// 음식 조회 함수
async function foodGet() {
  const callServer = await axios({
    method: 'get',
    url: 'http://localhost:3000/food',
  });
  const allFoods = callServer.data;
  console.log(allFoods);
  createAllFoodItems(allFoods);
}

//음식 생성
function createAllFoodItems(foods) {
  const foodsContainer = document.getElementById('foods-container');
  foodsContainer.innerHTML = '';

  foods.forEach(food => {
    foodsContainer.innerHTML += `<div class="col-lg-3 col-md-6 col-sm-6 mix food${food.category_id}">
        <div class="featured__item">
            <div class="featured__item__pic set-bg" data-setbg="${food.food_img}">
            </div>
            <div class="featured__item__text">
                <h6><button class="foodBtn" onclick='foodInfo(${food.id})' >${food.food_name}</button></h6>
            </div>
        </div>
    </div>`;
  });
}

// 음식 수정 추후
async function foodInfo(foodId) {
  console.log(foodId);
  url = `http://localhost:3000/food/${Number(foodId)}`;
  const callFoodIngredient = await axios.get(url);
  const allFoodsIngredient = callFoodIngredient.data;

  const foodIgredientHtml = allFoodsIngredient
    .map(item => `<li>${item.ingredient_name}</li>`)
    .join('');
  console.log(foodIgredientHtml);

  var popupW = 400;
  var popupH = 300;
  var left = Math.ceil((window.screen.width - popupW) / 2);
  var top = Math.ceil((window.screen.height - popupH) / 2);

  const newWindow = window.open(
    '',
    'userDataWindow',
    'width=' +
      popupH +
      ',height=' +
      popupH +
      ',left=' +
      left +
      ',top=' +
      top +
      ',scrollbars=yes,resizable=no,toolbar=no,titlebar=no,menubar=no,location=no',
  );
  newWindow.document.body.innerHTML = `
   <ul>
      <h2><h2>
      <h3>재료</h3>
      ${foodIgredientHtml}
   </ul>
  `;
}

foodGet();
categoryGet();

$(document).ready(function () {
  openTooltip('.button_control2', '.tooltip_layer2');
});

function openTooltip(selector, layer) {
  const $layer = $(layer);
}
// 툴팁버튼 처리
$(selector).on('click', function () {
  $layer.toggleClass('on');
});

function overTooltip() {
  var $this = $(selector);

  // 마우스 오버시 툴팁 레이어 노출
  $this.on('mouseover focusin', function () {
    $(this).next(layer).show();
  });
  // 마우스 떠날시 툴팁 레이어 숨김
  $this.on('mouseleave focusout', function () {
    if (!$layer.hasClass('on')) {
      $(this).next(layer).hide();
    }
  });
}
overTooltip();

// 검색 함수
async function search() {
  // 사용자가 입력한 검색어 가져오기
  const searchValue = document.getElementById('searchInput').value;

  // 검색어가 빈칸인 경우 메시지 표시
  if (!searchValue.trim()) {
    alert('궁금한 음식을 알려주세요!'); // 사용자에게 메시지 표시
    return;
  }

  // 검색어를 사용하여 서버에 GET 요청 보내기
  const response = await axios.get(
    `http://localhost:3000/food/search?q=${searchValue}`,
  );

  // 응답 데이터 가져오기
  const foods = response.data;

  // 응답 데이터를 화면에 표시하기 위한 함수 호출
  displaySearchResults(foods);
}

// 검색 결과를 화면에 표시하는 함수
function displaySearchResults(foods) {
  const foodsContainer = document.getElementById('foods-container');
  foodsContainer.innerHTML = '';

  foods.forEach(food => {
    const foodItem = document.createElement('div');
    foodItem.className = `col-lg-3 col-md-6 col-sm-6 mix food${food.category_id}`;
    foodItem.innerHTML = `
        <div class="featured__item">
            <div class="featured__item__pic set-bg">
                <img src="${food.food_img}" alt="${food.food_name}" style="width: 100%; height: 100%;">
            </div>
            <div class="featured__item__text">
                <h6><button class="foodBtn" onclick='foodInfo(${food.id})'>${food.food_name}</button></h6>
            </div>
        </div>`;
    foodsContainer.appendChild(foodItem);
  });
}
