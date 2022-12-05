(function ($) {
    $.fn.changePreviewImage = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("change", function (e) {
                let files = _this.prop('files');

                for (let i = 0; i < files.length; i++) {
                    let image = files[i];
                    let reader = new FileReader();
                    reader.readAsDataURL(image);

                    reader.onload = function (e) {
                        let img = {
                            data: e.currentTarget.result,
                            name: image.name,
                            size: image.size,
                            isSelf: 0
                        };

                        let reviewImage = $("img#" + _this.data("target"))
                            .prop("src", img.data)
                            .prop("alt", img.name)
                            .attr("data-self", img.isSelf) // FIXME: không câp nhật được khi sử dụng data
                            .show();
                    };
                }
            });
        };

        return _this.init();
    };
})(jQuery);
