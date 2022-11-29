import { getDate } from "/public/js/util.js";
import { uniqId } from "/public/js/util.js";

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
                        $("#tiny-chat").go(target);
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
                contentTimes = $(".chat-box__view:visible");
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

    $.fn.go = function (url) {
        $(location).prop("href", url);
    };

    // FIXME: khi hiện alert thì form không thể submiy được
    $.fn.showAlert = function (options) {
        let _this = this;

        let defaults = {
            id: uniqId(),
            autoClose: false
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let alerts = $(".alert");
            let exitAlert = $(".alert[id=" + settings.id + "]");

            if (!exitAlert.length) {
                let currentAlert = $(_this.createAlert(settings));
                let heights = (alerts.length - 1) * alerts.height();

                // 5px giãn cách
                currentAlert.css("top", heights + 5 * alerts.length);
                _this.append(currentAlert);

                $(".alert").onClickAction();

                if (settings.autoClose) {
                    setTimeout(() => {
                        currentAlert.remove();
                    }, 4000); // 1s chờ, 3s animation css
                }
            }
        };

        return _this.init();
    };

    $.fn.onResetForm = function (options) {
        let _this = this;

        let defaults = {
            id: uniqId(),
            autoClose: false
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Nhãn lỗi
            _this.find("label.label-error").empty();
            // All input
            _this.find("input").val("");
            // Input imgae
            _this.find(".review-image").find("img")
                .prop("src", "")
                .prop("alt", "")
                .data("self", 0);
        };

        return _this.init();
    };

    $.fn.onResetForm = function (options) {
        let _this = this;

        let defaults = {
            id: uniqId(),
            autoClose: false
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Nhãn lỗi
            _this.find("label.label-error").empty();
            // All input
            _this.find("input").val("");
            // Input imgae
            _this.find(".review-image").find("img")
                .prop("src", "")
                .prop("alt", "")
                .data("self", 0);
        };

        return _this.init();
    };

    // $.fn.onClickClipboard = function () {
    //     let _this = this;

    //     let defaults = {
    //         id: uniqId(),
    //         autoClose: false
    //     };

    //     let settings = $.extend({}, defaults, options);

    //     _this.init = function () {
    //         $(_this).on(function (e) {
    //             e.preventDefault();

    //             $(this).val().select();
    //             document.execCommand("copy");
    //         });
    //     };

    //     return _this.init();
    // };
})(jQuery);