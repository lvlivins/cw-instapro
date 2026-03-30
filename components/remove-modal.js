import {AUTH_PAGE} from "../routes.js";
import {goToPage} from "../index.js";

// удал дублирование модалки
function closePostActionsModal() {
  const modal = document.querySelector(".post-actions-modal");

  if (modal) {
    modal.remove();
  }
}

function openPostActionsModal({
                                text,
                                firstButtonText,
                                secondButtonText,
                                firstClick,
                                secondClick,
                              }) {
  closePostActionsModal();

  const modal = document.createElement("div");
  modal.className = "post-actions-modal";

  modal.innerHTML = `
    <div class="post-actions-modal__box">
      <p class="post-actions-modal__text">${text}</p>
      <div class="post-actions-modal__actions">
        <button class="post-actions-modal__button js-first-button">
          ${firstButtonText}
        </button>
        <button class="post-actions-modal__button js-second-button">
          ${secondButtonText}
        </button>
      </div>
    </div>
  `;

  document.body.append(modal);

  modal.querySelector(".js-first-button").addEventListener("click", () => {
    closePostActionsModal(); //закрыть

    if (firstClick) { // выполнить
      firstClick();
    }
  });

  modal.querySelector(".js-second-button").addEventListener("click", () => {
    closePostActionsModal();

    if (secondClick) {
      secondClick();
    }
  });
}

export function openDeletePostModal({confirmClick, cancelClick}) {
  openPostActionsModal({
    text: "Точно хочешь это сделать?",
    firstButtonText: "Да",
    secondButtonText: "Нет",
    firstClick: confirmClick,
    secondClick: cancelClick,
  });
}

export function openAuthPostModal() {
  openPostActionsModal({
    text: "Чтобы взаимодействовать с постами, нужно войти или зарегистрироваться.",
    firstButtonText: "Войти",
    secondButtonText: "Зарегистрироваться",
      firstClick: () => {
      goToPage(AUTH_PAGE);
    },
    secondClick: () => {
      goToPage(AUTH_PAGE);

      const toggleButton = document.getElementById("toggle-button");

      if (toggleButton) {
        toggleButton.click();
      }
    },
  });
}