import {renderHeaderComponent} from "./header.js";
import {posts, user, profileUserId} from "../index.js";

export function renderMyProfilePageComponent({appEl}) {
  // находим посты пользователя
  const userPosts = [];

  /*const currentProfileId = profileUserId || user?.id || user?._id || null;*/

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    if (post.user.id === profileUserId) {
      userPosts.push(post);
    }
  }

/*  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    const postUserId = post.user.id || post.user._id;

    if (postUserId === currentProfileId) {
      userPosts.push(post);
    }
  }*/

  // формируем html постов
  let postsHtml = "";

  for (let i = 0; i < userPosts.length; i++) {
    const post = userPosts[i];

    postsHtml += `
      <li class="post">
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <p class="post-text">
          ${post.description}
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