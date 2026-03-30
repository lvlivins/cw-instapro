import {goToPage, logout, user, posts, profileUserId} from "../index.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE
} from "../routes.js";

export function renderHeaderComponent({element}) {
  /*Рендер заголовка.*/
  let profileView = "";
  let currentUserView = "";

  if (profileUserId) {
    if (!user || profileUserId !== user._id) {

      let foundUser = null;

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        if (post.user.id === profileUserId) {
          foundUser = post.user;
          break;
        }
      }

      if (foundUser) {
        profileView = `
      <div class="header-user-info">
        <img src="${foundUser.imageUrl}" class="header-user-info__image" alt="Фото пользователя">
        <p class="header-user-info__name">${foundUser.name}</p>
      </div>
    `;
      }
    }
  }

    if (user) {
      currentUserView = `
    <div class="header-user-info header-user-info-me">
      <img src="${user.imageUrl}" class="header-user-info__image" alt="Фото пользователя">
      <p class="header-user-info__name">${user.name}</p>
    </div>
  `;
    }

    element.innerHTML = `
  <div class="page-header">
     <div class="header-box">
      <h1 class="logo logo_mobile">instapro</h1>
      <button class="header-button add-or-login-button">
      ${user ? `<div title="Добавить пост" class="add-post-sign"></div>` : "Войти"}
      </button>
      </div>
      <div class="header-controls">
        ${profileView}
        ${currentUserView}
        ${user ? `<button title="${user.name}" class="header-button logout-button">Выйти</button>` : ""}
      </div>
  </div>
  `;


    /* Обработчик клика по кнопке "Войти"/ + пост */
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
    element.querySelector(".header-user-info-me")?.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: user._id,
      });
    });

    return element;
}
