import { getDate } from "/public/js/util.js";

(function ($) {
    $.fn.onClickAction = function (options) {
        let _this = this;

        let defaults = {
            elements: "body"
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(settings.elements).on("click", settings.selector, function (e) {
                e.preventDefault();

                let target = $(this).data("target");
                let prevtarget = $(this).data("prevtarget");
                let action = $(this).data("action");
                let value = $(this).data("value");

                switch (action) {
                    case "toggle": {
                        $("#" + prevtarget).toggle();
                        $("#" + target).toggle();
                        $(".bg-layout").toggle();
                    }
                        break;
                    case "show": {
                        $("." + prevtarget).hide();
                        $("#" + target).show();
                        $(this)
                            .addClass("active")
                            .siblings()
                            .removeClass("active");
                    }
                        break;
                    case "link": {
                        $("#client-tiny-chat").go(target);
                    }
                        break;
                    case "close": {
                        $("#" + target).remove();

                        switch (value) {
                            case "alert": {
                                let items = $("." + value);
                                items.each(function (index, item) {
                                    let _item = $(item);
                                    _item.css(
                                        "top",
                                        (_item.height() * index + 5 * index) - _item.height() // 5px giãn cách
                                    );
                                });
                            }
                                break;
                            default:
                                break;
                        }
                    }
                        break;
                    default:
                        break;
                }

                if (typeof settings.callback == "function") {
                    settings.callback($(this));
                }
            });
        };

        return _this.init();
    };

    $.fn.disabledInput = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.find("input, .btn").prop('disabled', true);
        };

        return _this.init();
    };

    $.fn.endabaleInput = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.find("input, .btn").prop('disabled', false);
        };

        return _this.init();
    };

    $.fn.emptyInput = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.find("input").val("");
        };

        return _this.init();
    };

    $.fn.updateMSGTime = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let contentTimes = null;

            if (_this.length) {
                contentTimes = _this;
            } else {
                contentTimes = $(".chat-box__view");
            }

            contentTimes = contentTimes.find(".content-time");
            contentTimes.each((index, value) => {
                let contentTime = $(value);
                let time = contentTime.data("value");
                let upTime = getDate(time);
                contentTime.text(upTime);
            });

        };

        return _this.init();
    }

    $.fn.changePreviewImage = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

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
                        .attr("data-self", img.isSelf);  // Không câp nhật được khi sử dụng data
                };
            }
        });
    };
})(jQuery);
