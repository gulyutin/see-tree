const axios = window.axios;

$(function () {
  const form = $("#form");
  const fileInput = $("#file");
  const submitBtn = $("#submit-btn");
  const progress = $("#progress");
  const progressBar = $("#bar");
  const result = $("#result");

  form.on("submit", function (e) {
    e.preventDefault();
    const file = fileInput[0].files[0];
    const formData = new FormData();
    formData.append("file", file);
    submitBtn.prop("disabled", true);
    progress.show();

    axios
      .post("http://localhost:8080/api/v1/recognize", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: function (e) {
          if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            progressBar.css("width", percent + "%");
          }
        },
        responseType: 'blob',
      })
      .then(function (response) {
        const treeCount = response.headers["df-boxes-count"];
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(response.data);
        const img = new Image();
        img.onload = function () {
          result.empty().append(img);
          result.append(`<p>Количество деревьев на изображении: ${treeCount}</p>`);
          submitBtn.prop("disabled", false);
          progress.hide();
        };
        img.src = imageUrl;
      })
      .catch(function (error) {
        console.error("Произошла ошибка: " + error);
        submitBtn.prop("disabled", false);
        progress.hide();
      });
  });
});