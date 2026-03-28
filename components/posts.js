import {USER_POSTS_PAGE} from "../routes.js";
import {renderHeaderComponent} from "./header.js";
import {user, posts, goToPage} from "../index.js";
import {addLike, removeLike} from "../api.js";

export function renderPostsPageComponent({appEl}) {
  /* DONE реализовать рендер постов из api*/
  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
// изм дату из апи
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  /*<div class="post-header" data-user-id="${post.user.id}" data-user-name="${post.user.name}" data-user-image="${post.user.imageUrl}">
   <img src="${post.user.imageUrl}" class="post-header__user-image">
   <p class="post-header__user-name">${post.user.name}</p>
   </div>*/
  const postsHtml = posts
    .map((post) => {
      return `
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}" data-user-name="${post.user.name}" data-user-image="${post.user.imageUrl}">
            <div class="post-header__user-content">
                <img src="${post.user.imageUrl}" class="post-header__user-image">
                <p class="post-header__user-name">${post.user.name}</p>
            </div>

            <div class="post-header__actions">
              <button class="post-header__menu-button" type="button">&#8942</button>
            </div>
          </div>

          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>

          <div class="post-likes">
          <div class="post-likes__box">
            <button data-post-id="${post.id}" class="like-button">
              <img src="./assets/images/${post.isLiked ? "like-active.svg" : "like-not-active.svg"
      }">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes.length}</strong>
            </p>
            </div>
          </div>

          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
          </p>

          <p class="post-date">
            ${formatDate(post.createdAt)}
          </p>
        </li>
      `;
    })
    .join("");

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts posts-main">
                  ${
    posts.length === 0
      ? `<p class="posts-empty">Постов пока нет</p>`
      : postsHtml
  }
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  // обработчик клика по пользователю
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  // обработчик клика по лайку - общ пост
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
          renderPostsPageComponent({appEl});
        });

        return;
      }

      addLike({token, postId}).then(() => {
        post.isLiked = true;
        post.likes.length++;
        renderPostsPageComponent({appEl});
      });
    });
  }
}