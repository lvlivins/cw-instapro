import {loginUser, registerUser} from "../api.js";
import {renderHeaderComponent} from "./header.js";
import {renderUploadImageComponent} from "./upload-image.js";

export function renderAuthPageComponent({appEl, setUser}) {

  let loginMode = true;
  let imageUrl = "";

  const renderForm = () => {
    const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
           <div class="page-content page-reg">
          <div class="form">
              <h3 class="form-title">
                ${loginMode ? "Вход в&nbsp;Instapro" : "Регистрация в&nbsp;Instapro"}
              </h3>
              <form class="form-inputs">
                  ${!loginMode ? `<div class="upload-image-container"></div><input type="text" id="name-input" class="input" placeholder="Имя" />` : ""}
                  <input type="text" id="login-input" class="input" placeholder="Логин" />
                  <input type="password" id="password-input" class="input" placeholder="Пароль" />
                  <div class="form-error"></div>
                  <button type="button" class="button" id="login-button">${loginMode ? "Войти" : "Зарегистрироваться"}</button>
              </form>
              <div class="form-footer">
                <p class="form-footer-title">
                  ${loginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                  <button type="button" class="link-button" id="toggle-button">
                    ${loginMode ? "Зарегистрироваться." : "Войти."}
                  </button>
                </p>
              </div>
          </div>
          </div>
      </div>    
    `;

    appEl.innerHTML = appHtml;

    /* Устанавливает сообщение об ошибке в форме.*/
    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    // рендер заголовок страницы
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    // убираем кнопку войти на странице auth
    const headerButton = appEl.querySelector(".add-or-login-button");
    if (headerButton) {
      headerButton.style.display = "none";
    }

    // Если режим регистрации, рендер компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    // Обработка клика на кнопку входа/регистрации
    document.getElementById("login-button").addEventListener("click", () => {
      setError("");

      if (loginMode) {
        // Обработка входа
        const login = document.getElementById("login-input").value;
        const password = document.getElementById("password-input").value;

        if (!login) {
          alert("Введите логин");
          return;
        }

        if (!password) {
          alert("Введите пароль");
          return;
        }

        loginUser({login, password})
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      } else {
        // Обработка регистрации
        const login = document.getElementById("login-input").value;
        const name = document.getElementById("name-input").value;
        const password = document.getElementById("password-input").value;

        if (!name) {
          alert("Введите имя");
          return;
        }

        if (!login) {
          alert("Введите логин");
          return;
        }

        if (!password) {
          alert("Введите пароль");
          return;
        }

        if (!imageUrl) {
          alert("Не выбрана фотография");
          return;
        }

        registerUser({login, password, name, imageUrl})
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      }
    });

    // Обработка переключения режима (вход - регистрация)
    document.getElementById("toggle-button").addEventListener("click", () => {
      loginMode = !loginMode;
      renderForm(); // Перерисовываем форму с новым режимом
    });
  };

  renderForm();
}
