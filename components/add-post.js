import {uploadImage} from "../api.js";
import {renderHeaderComponent} from "./header.js";

export function renderAddPostPageComponent({appEl, onAddPostClick}) {

  const render = () => {
    // DONE Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
        <div class="header-container"></div>

        <div class="page-content page-content__new-post">
          <div class="add-post">
            <h3 class="form-title">Добавить пост</h3>

            <div class="form-inputs">
            <label for="image-input" class="custom-file-upload" id="file-label">Выберите файл</label>
              <input type="file" id="image-input" class="input" />
              <textarea
                id="description-input"
                class="input add-post-textarea"
                placeholder="Добавить комментарий...."
              ></textarea>

              <div class="form-error" id="add-post-error"></div>

              <button class="button" id="add-button">Добавить</button>
            </div>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const descriptionInput = document.getElementById("description-input");
    const errorElement = document.getElementById("add-post-error");
    const imageInput = document.getElementById("image-input");
    const fileLabel = document.getElementById("file-label");
    const addButton = document.getElementById("add-button");

    imageInput.addEventListener("change", () => {
      if (imageInput.files[0]) {
        fileLabel.textContent = "Файл выбран";
      }
    });

    addButton.addEventListener("click", () => {
      const file = imageInput.files[0];
      const description = descriptionInput.value;

      if (!file) {
        errorElement.textContent = "Выберите изображение";
        return;
      }

      if (!description) {
        errorElement.textContent = "Введите описание";
        return;
      }

      errorElement.textContent = "Загрузка...";

      uploadImage({file})
        .then((data) => {
          if (!data.fileUrl) {
            throw new Error("Не удалось загрузить изображение");
          }

          return onAddPostClick({
            description: description, imageUrl: data.fileUrl,
          });
        })
        .catch((error) => {
          errorElement.textContent = error.message;
        });
    });
  };

  render();
}