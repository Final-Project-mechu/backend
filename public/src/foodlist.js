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
                <h6><button id="openNewWindowBtn"><a href="#">${food.food_name}</a></button></h6>
            </div>
        </div>
    </div>`;
  });
}
foodGet();

document
  .getElementById('openNewWindowBtn')
  .addEventListener('click', function () {
    const foodsIngredientData = createAllFoodIngredient;

    const foodIgredientHtml = foodsIngredientData
      .map(item => `<li>${ingredient.name}</li>`)
      .join('');

    const newWindow = window.open('', 'userDataWindow', 'width=400,height=300');
    newWindow.document.body.innerHTML = `
         <ul>
            ${foodIgredientHtml}
         </ul>
        `;
  });

async function foodIngredient() {
  const callFoodIngredient = await axios({
    method: 'get',
    url: 'http://localhost:3000/food/:food_id',
  });
  const allFoodsIngredient = callFoodIngredient.data;
  createAllFoodIngredient(allFoodsIngredient);
}

// <h6><a href="http://localhost:3000/food/${food.id}">${food.food_name}</a></h6>
