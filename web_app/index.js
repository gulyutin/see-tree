const axios = window.axios;

$(() => {
    const form = $("#form");
    const fileInput = $("#file");
    const submitBtn = $("#submit-btn");
    const goBackBtn = $("#go-back-btn");
    const progressBarUploadDiv = $("#progressBarUploadDiv");
    const progressBarUploadBar = $("#progressBarUploadBar");
    const result = $("#result");
    const treeCount = $("#tree-count");
    const resultImg = $("#result-img");

    function handleError(error) {
        console.error("Произошла ошибка: " + error);
        submitBtn.prop("disabled", false);
        progressBarUploadDiv.hide();
    }

    async function getData(formData) {
        try {
            const response = await axios.post("https://c3de-193-218-138-88.ngrok-free.app/api/v1/recognize", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: function (e) {
                    if (e.event.lengthComputable) {
                        const percent = (e.event.loaded / e.event.total) * 100;
                        progressBarUploadBar.attr("aria-valuenow", percent).css("width", percent + "%");
                    }
                },
                responseType: 'blob',
            })
            if (response.status != 200) {
                console.log(response.status)
                throw new Error();
            }
            return response
        }
        catch (error) {
            handleError(error);
            console.error(error);
        }
    }

    submitBtn.on("click", async (e) => {
        submitBtn.prop("disabled", true);
        form.hide();
        progressBarUploadDiv.show();

        const file = fileInput[0].files[0];
        const formData = new FormData();
        formData.append("file", file);

        getData(formData)
            .then((response) => {
                progressBarUploadDiv.hide()
                goBackBtn.show();
                const treeCountValue = response.headers["df-boxes-count"];
                const urlCreator = window.URL || window.webkitURL;
                const imageUrl = urlCreator.createObjectURL(response.data);
                resultImg[0].onload = function () {
                    treeCount.html(`Количество деревьев на изображении: ${treeCountValue}`);
                    resultImg[0].width = 1000;
                    result.show();
                    submitBtn.prop("disabled", false);
                };
                resultImg[0].src = imageUrl;
            })
            .catch(function (error) {
                console.error("Произошла ошибка: " + error);
                submitBtn.prop("disabled", false);
                progressBarUploadDiv.hide();
                goBackBtn.show();
            });
    });

    goBackBtn.on("click", async (e) => {
        form.show();
        result.hide();
        fileInput.val("");
        goBackBtn.hide();
    });
    
});