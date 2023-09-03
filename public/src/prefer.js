document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector(".button2");

  button.addEventListener("click", () => {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h3>음식</h3>
        <ul class="food-list">
          <li>돼지갈비</li>
          <li>김치찌개</li>
          <li>칼국수</li>
          <!-- 원하는 음식 항목을 나열 -->
        </ul>
        <h3>재료</h3>
        <ul class="ingredient-list">
          <li>아몬드봉봉</li>
          <li>치즈케이크</li>
          <li>귤탕후루</li>
          <!-- 원하는 재료 항목을 나열 -->
        </ul>
      </div>
    `;

    document.body.appendChild(modal);

    const closeButton = document.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
    });

    modal.style.display = "block";
  });
});
