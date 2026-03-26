import {renderHeaderComponent} from "./header.js";
import {posts, profileUserId, user} from "../index.js";
import {addLike, removeLike} from "../api.js";

export function renderMyProfilePageComponent({appEl}) {

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
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

      <div class="post-likes">
        <button data-post-id="${userPosts[i].id}" class="like-button">
          <img src="./assets/images/${userPosts[i].isLiked ? "like-active.svg" : "like-not-active.svg"}">
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${userPosts[i].likes.length}</strong>
        </p>
      </div>

      <p class="post-text">
        <span class="user-name">${userPosts[i].user.name}</span>
        ${userPosts[i].description}
      </p>

      <p class="post-date">
        ${formatDate(userPosts[i].createdAt)}
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

  // обработчик клика по лайку - в профиле
  for (let btn of document.querySelectorAll(".like-button")) {
    btn.addEventListener("click", () => {
      if (!user) {
        return;
      }

      const postId = btn.dataset.postId;
      const token = `Bearer ${user.token}`;
      const post = posts.find((p) => p.id === postId);

      if (post.isLiked) {
        removeLike({token, postId}).then(() => {
          post.isLiked = false;
          post.likes.length--;
          renderMyProfilePageComponent({appEl});
        });

        return;
      }

      addLike({token, postId}).then(() => {
        post.isLiked = true;
        post.likes.length++;
        renderMyProfilePageComponent({appEl});
      });
    });
  }
}