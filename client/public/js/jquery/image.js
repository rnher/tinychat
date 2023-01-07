import { CONF_UPLOAD } from "/public/js/config.js";

(function ($) {
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
