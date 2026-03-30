import {renderHeaderComponent} from "./header.js";
import {posts, profileUserId, user} from "../index.js";
import {addLike, removeLike, deletePost} from "../api.js";
import {openDeletePostModal, openAuthPostModal} from "./remove-modal.js";

export function renderMyProfilePageComponent({appEl}) {

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getMyUserId = () => {
    if (!user) {
      return "";
    }

    return user._id;
  };

  // находим посты пользователя
  const userPosts = [];

  for (let i = 0; i < posts.length; i++) {
    if (posts[i].user.id === profileUserId) {
      userPosts.push(posts[i]);
    }
  }

  let postsHtml = "";

  for (let i = 0; i < userPosts.length; i++) {
    postsHtml += `
    <li class="post">
      <div class="post-image-container">
        <img class="post-image" src="${userPosts[i].imageUrl}">
      </div>

      <div class="post-likes">
      <div class="post-likes__box">
        <button data-post-id="${userPosts[i].id}" class="like-button">
          <img src="./assets/images/${userPosts[i].isLiked ? "like-active.svg" : "like-not-active.svg"}">
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${userPosts[i].likes.length}</strong>
        </p>
        </div>
        <div class="post-header__actions">
          <button data-post-id="${userPosts[i].id}" class="post-header__menu-button" type="button">&#8942</button>
        </div>
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
    contentHtml = `<ul class="posts">${postsHtml}</ul>`;
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

  // рендер хэдер
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

  for (let button of document.querySelectorAll(".post-header__menu-button")) {
    button.addEventListener("click", () => {
      const postId = button.dataset.postId;
      const post = posts.find((post) => post.id === postId);

      if (!user) {
        openAuthPostModal();
        return;
      }

      if (!post) {
        return;
      }

      if (post.user.id !== getMyUserId()) {
        return;
      }

      openDeletePostModal({
          confirmClick: () => {
            deletePost({
              token: `Bearer ${user.token}`,
              postId,
            }).then(() => {
              window.location.reload();
            });
          },
        cancelClick: () => {},
      });
    });
  }
}