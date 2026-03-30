const personalKey = "prod";
const baseHost = "https://wedev-api.sky.pro";
/* "https://webdev-hw-api.vercel.app";*/
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({token}) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      return data.posts;
    });
}

export function registerUser({login, password, name, imageUrl}) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({login, password}) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({file}) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

// добавляем лайк
export function addLike({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    return response.json();
  });
}

// убираем лайк
export function removeLike({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    return response.json();
  });
}
// добавить пост
export function addPost({token, description, imageUrl}) {
  return fetch(postsHost, {
    method: "POST",
    headers: {
      Authorization: token,
    },
    body: JSON.stringify({
      description,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверные данные");
    }

    if (response.status === 401) {
      throw new Error("Войдите или зарегистрируйтесь, чтобы добавить пост");
    }

    return response.json();
  });
}
// удалить пост
export function deletePost({token, postId}) {
  return fetch(`${postsHost}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    return response.json().then((data) => {
      if (!response.ok) {
        throw new Error(data.error || "Не удалось удалить пост");
      }

      if (data.result !== "ok") {
        throw new Error("Пост не был удален");
      }

      return data;
    });
  });
}

// router.beforeEach((to, from, next) => {
//   const userInfo = localStorage.getItem('userInfo') // если в localStorage есть userInfo, роутер не выкинет на /login и пустит на главную
//
//   let user = null
//
//   if (userInfo) {
//     try {
//       user = JSON.parse(userInfo)
//     } catch (error) {
//       user = null
//     }
//   }
//
//   if (to.meta.requiresAuth && (!user || !user.token)) { // есть ли объект пользователя + токен
//     next('/login')
//     return
//   }
//   next()
// })