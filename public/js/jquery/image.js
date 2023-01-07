import "/public/js/libraries/jquery-3.6.1.js";
import { CONF_UPLOAD } from "/public/js/config.js";

(function ($) {
    $.fn.changePreviewImage = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("change", function (e) {
                let input = $(this);
                let files = input.prop("files");

                for (let i = 0; i < files.length; i++) {
                    let image = files[i];

                    let formats = CONF_UPLOAD.image.formats;
                    if (formats.indexOf(image.type) != -1) {

                        let reader = new FileReader();
                        reader.readAsDataURL(image);

                        reader.onload = function (e) {
                            let img = {
                                data: e.currentTarget.result,
                                name: image.name,
                                size: image.size,
                                isSelf: 0
                            };

                            let buttonDelete = $(`<button 
                                                data-target="${input.data("target")}"
                                                title="Xóa hình" 
                                                class="btn-icon btn-delete-image">
                                                    <i class="fa-solid fa-xmark"></i>
                                            </button>`);

                            let reviewImage = $("img#" + _this.data("target"))
                                .prop("src", img.data)
                                .prop("alt", img.name)
                                .attr("data-self", img.isSelf) // FIXME: không câp nhật được khi sử dụng data
                                .show();
                            reviewImage.parent()
                                .append(buttonDelete);

                            buttonDelete.on("click", function (e) {
                                e.preventDefault();
                                let btn = $(this);

                                let image = $(".review-image").find(`img#${btn.data("target")}`);
                                image.prop("src", image.data("src"))
                                    .prop("alt", image.data("alt"))
                                    .data("self", 1);

                                btn.remove();
                            });
                        };
                    };
                };
            });
        };

        return _this.init();
    };

    $.fn.changeMessageImages = function (options) {
        let _this = this;

        let defaults = {
            images: []
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("change", function (e) {
                e.preventDefault();

                let input = $(this);
                let files = input.prop("files");

                for (let i = 0; i < files.length; i++) {
                    let image = files[i];

                    let formats = CONF_UPLOAD.image.formats;

                    if (formats.indexOf(image.type) != -1) {
                        let reader = new FileReader();
                        reader.readAsDataURL(image);

                        reader.onload = function (e) {
                            let img = {
                                data: e.currentTarget.result,
                                name: image.name,
                                size: image.size,
                            };
                            settings.images.push(img);

                            if (files.length == settings.images.length
                                && settings.callback && typeof settings.callback == "function"
                            ) {
                                let images = settings.images;
                                settings.images = [];
                                settings.callback(images);
                            }
                        };
                    };
                };
            });
        };

        return _this.init();
    };
})(jQuery);
