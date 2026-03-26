import {renderHeaderComponent} from "./header.js";
import {posts, user, profileUserId} from "../index.js";

export function renderMyProfilePageComponent({appEl}) {
  // находим посты пользователя
  const userPosts = [];

  for (let i = 0; i < posts.length; i++) {
    if (posts[i].user.id === profileUserId) {
      userPosts.push(posts[i]);
    }
  }

  // формируем html постов
  let postsHtml = "";

  for (let i = 0; i < userPosts.length; i++) {
    postsHtml += `
    <li class="post">
      <div class="post-image-container">
        <img class="post-image" src="${userPosts[i].imageUrl}">
      </div>
      <p class="post-text">
        ${userPosts[i].description}
      </p>
    </li>
  `;
  }

  // формируем надпись, если нет постов
  let contentHtml = "";

  if (userPosts.length === 0) {
    contentHtml = `
      <div class="profile-empty-text">
         <p>Изображения, которыми вы делитесь, будут показываться в профиле.</p>
          <p>Опубликуйте первый пост через кнопку
          <span class="add-post-sign profile-empty-text__sign"></span>
          </p>
      </div>
    `;
  } else {
    contentHtml = `
      <ul class="posts">
        ${postsHtml}
      </ul>
    `;
  }

  // общий html страницы
  appEl.innerHTML = `
  <div class="page-container">
    <div class="header-container"></div>

    <div class="page-content">
      ${contentHtml}
    </div>
  </div>
`;

  // рендерим хэдер
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
}