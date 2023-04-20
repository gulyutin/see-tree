const axios = window.axios;

$(function () {
    const form = $("#form");
    const fileInput = $("#file");
    const submitBtn = $("#submit-btn");
    const goBackBtn = $("#go-back-btn");
    const progressBarUploadDiv = $("#progressBarUploadDiv");
    const progressBarUploadBar = $("#progressBarUploadBar");
    const result = $("#result");

    submitBtn.on("click", function (e) {
        submitBtn.prop("disabled", true);
        form.hide();
        progressBarUploadDiv.show();

        const file = fileInput[0].files[0];
        const formData = new FormData();
        formData.append("file", file);


        axios
            .post("http://localhost:8080/api/v1/recognize", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: function (e) {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        progressBarUploadBar.css("width", percent + "%");
                    }
                },
                responseType: 'blob',
            })
            .then(function (response) {
                progressBarUploadDiv.hide()
                goBackBtn.show();
                const headers = {};
                Object.keys(response.headers).forEach(key => headers[key.toLowerCase()] = response.headers[key]);
                const treeCount = headers["df-boxes-count"];
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL(response.data);
                const img = new Image();
                img.onload = function () {
                    result.append(`<p>Количество деревьев на изображении: ${treeCount}</p>`);
                    result.empty().append(img);
                    submitBtn.prop("disabled", false);
                };
                img.src = imageUrl;
            })
            .catch(function (error) {
                console.error("Произошла ошибка: " + error);
                submitBtn.prop("disabled", false);
                progressBarUploadDiv.hide();
                goBackBtn.show();
            });
    });

    goBackBtn.on("click", function (e) {
        form.show();
        goBackBtn.hide();
    });
});