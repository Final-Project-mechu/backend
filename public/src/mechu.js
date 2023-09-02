document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-button");
  const subFilterButtons = document.querySelectorAll(".sub-filter-button");
  const foodItems = document.querySelectorAll(".food-item");
  const mainContent = document.querySelector("main");

  // 처음에는 "식사" 버튼을 선택한 상태로 시작
  // filterButtons.forEach(button => {
  //   if (button.getAttribute('data-category') === 'meal') {
  //     button.classList.add('active');
  //   } else {
  //     button.classList.remove('active');
  //   }
  // });

  // 처음에는 "식사"와 "디저트"만 노출
  subFilterButtons.forEach((subButton) => {
    const subCategory = subButton.getAttribute("data-category");
    if (
      subCategory === "korean" ||
      subCategory === "chinese" ||
      subCategory === "japanese" ||
      subCategory === "western" ||
      subCategory === "indian" ||
      subCategory === "coffee" ||
      subCategory === "cake" ||
      subCategory === "bread" ||
      subCategory === "tanghulu" ||
      subCategory === "icecream"
    ) {
      subButton.style.display = "none";
    } else {
      subButton.style.display = "none";
    }
  });

  // 처음에는 메인 내용 숨기기
  mainContent.style.display = "none";

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");

      // 선택된 버튼에 "active" 클래스 추가
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      // 메인 내용 표시
      mainContent.style.display = "block";

      foodItems.forEach((item) => {
        if (category === "all" || item.classList.contains(category)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });

      // "식사" 버튼 클릭 시
      if (category === "meal") {
        subFilterButtons.forEach((subButton) => {
          const subCategory = subButton.getAttribute("data-category");
          if (
            subCategory === "all-meal" ||
            subCategory === "korean" ||
            subCategory === "chinese" ||
            subCategory === "japanese" ||
            subCategory === "western" ||
            subCategory === "indian"
          ) {
            subButton.style.display = "block";
          } else {
            subButton.style.display = "none";
          }
        });
      }
      // "디저트" 버튼 클릭 시
      else if (category === "dessert") {
        subFilterButtons.forEach((subButton) => {
          const subCategory = subButton.getAttribute("data-category");
          if (
            subCategory === "coffee" ||
            subCategory === "cake" ||
            subCategory === "bread" ||
            subCategory === "tanghulu" ||
            subCategory === "icecream"
          ) {
            subButton.style.display = "block";
          } else {
            subButton.style.display = "none";
          }
        });
      }
      // 다른 카테고리 버튼 클릭 시
      else {
        subFilterButtons.forEach((subButton) => {
          subButton.style.display = "none";
        });
      }
    });
  });

  subFilterButtons.forEach((subButton) => {
    subButton.addEventListener("click", () => {
      const subCategory = subButton.getAttribute("data-category");

      foodItems.forEach((item) => {
        const mainCategory = item.classList.contains("meal")
          ? "meal"
          : "dessert";

        if (
          subCategory === "all" ||
          item.classList.contains(subCategory) ||
          subCategory === mainCategory
        ) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
});
