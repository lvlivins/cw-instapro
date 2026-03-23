import {goToPage, logout, user, page} from "../index.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE
} from "../routes.js";

/* Компонент заголовка страницы.
Шапка страницы = лого, btn добавления постов, btn входа и выхода
@param {HTMLElement} params.element - HTML-элемент, в который будет рендериться заголовок.
@returns {HTMLElement} Возвращает элемент заголовка после рендеринга. */
export function renderHeaderComponent({element}) {
  /*Рендерит содержимое заголовка.*/
  let profileView = "";

  if (user) {
    profileView = `
      <div class="header-user-info">
        <img src="${user.imageUrl}" class="header-user-info__image" alt="Фото пользователя">
        <p class="header-user-info__name">${user.name}</p>
      </div>
    `;
  }

  element.innerHTML = `
  <div class="page-header">
     <div class="header-box">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      ${user ? `<div title="Добавить пост" class="add-post-sign"></div>` : "Войти"}
      </button>
      </div>
      <div class="header-controls">
        ${profileView}
        ${user ? `<button title="${user.name}" class="header-button logout-button">Выйти</button>` : ""}
      </div>
  </div>
  `;


  /* Обработчик клика по кнопке "Добавить пост"/"Войти".
  Если пользователь авторизован, перенаправляет на страницу добавления постов.
  Если пользователь не авторизован, перенаправляет на страницу авторизации.*/
  element
    .querySelector(".add-or-login-button")
    .addEventListener("click", () => {
      if (user) {
        goToPage(ADD_POSTS_PAGE);
      } else {
        goToPage(AUTH_PAGE);
      }
    });

  /*Обработчик клика по логотипу. Перенаправляет на страницу с постами.*/
  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(POSTS_PAGE);
  });

  /*Обработчик клика по кнопке "Выйти".
  Если кнопка существует (т.е. пользователь авторизован), вызывает функцию `logout`.*/
  element.querySelector(".logout-button")?.addEventListener("click", logout);

  // Обработчик клика по юзер-блоку в хэдере
  element.querySelector(".header-user-info")?.addEventListener("click", () => {
    goToPage(USER_POSTS_PAGE, {
      userId: user.id,
    });
  });

  return element;
}
