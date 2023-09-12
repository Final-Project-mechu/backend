// 카테고리 조회 함수
// id, category_name,
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
// id, food_id, category_id, food_img, deleteAt 불러옴
async function foodGet() {
  const callServer = await axios({
    method: 'get',
    url: 'http://localhost:3000/food',
  });
  const allFoods = callServer.data;
  console.log(allFoods);
  createAllFoodItems(allFoods);
}
function createAllFoodItems(foods) {
  const foodsContainer = document.getElementById('foods-container');
  foodsContainer.innerHTML = '';

  foods.forEach(food => {
    foodsContainer.innerHTML += `<div class="col-lg-3 col-md-6 col-sm-6 mix food${food.category_id}">
        <div class="featured__item">
            <div class="featured__item__pic set-bg" data-setbg="${food.food_img}">
            </div>
            <div class="featured__item__text">
                <h6><button onclick='foodInfo(${food.id})' >${food.food_name}</button></h6>
            </div>
        </div>
    </div>`;
  });
}
foodGet();

// window.onload = function () {
//   document
//     .getElementById('openNewWindowBtn')
//     .addEventListener('click', async function () {
//       const fId = document.getElementById('openNewWindowBtn');
//       const foodId = fId.getAttribute('data-food-id');
//       console.log(foodId);

//       url = `http://localhost:3000/food/${Number(foodId)}`;
//       const callFoodIngredient = await axios.get(url);
//       const allFoodsIngredient = callFoodIngredient.data;

//       const foodIgredientHtml = allFoodsIngredient
//         .map(item => `<li>${item.ingredient_name}</li>`)
//         .join('');

//       console.log(foodIgredientHtml);
//       const newWindow = window.open(
//         '',
//         'userDataWindow',
//         'width=400,height=300',
//       );
//       newWindow.document.body.innerHTML = `
//          <ul>
//             <h2><h2>
//             <h3>재료</h3>
//             ${foodIgredientHtml}
//          </ul>
//         `;
//     });
// };

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

// <h6><a href="http://localhost:3000/food/${food.id}">${food.food_name}</a></h6>
