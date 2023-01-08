import "/public/js/libraries/jquery-3.6.1.js";

(function ($) {
    $.fn.loadingLayout = function (options) {
        let _this = this;

        let defaults = {
            isShow: true,
            type: "water",
            target: null
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            if (settings.isShow) {
                switch (settings.type) {
                    case "water": {
                        $(_this).append(`<div class="loading-` + settings.type + ` loading"></div>`);
                        if (settings.target) {
                            let target = $("#" + settings.target).hide();
                        }
                    }
                        break;
                    default:
                        break;
                }
            } else {
                $(_this).find(".loading").remove();
                if (settings.target) {
                    let target = $("#" + settings.target).show();
                }
            }
        };

        return _this.init();
    };

    $.fn.onClickBlurBackgound = function (options) {
        let _this = this;

        let defaults = {
            isShow: true,
            type: "water",
            target: null
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $("#tiny-chat .blur-bg_layout").on("click", function (e) {
                e.preventDefault();

                let blur_bg_layout = $(this);
                let target = $(settings.target);

                if (blur_bg_layout.data("targetname") == settings.targetname) {
                    blur_bg_layout.hide();
                }

                if (target.length) {
                    target.hide();
                }
            })
        };

        return _this.init();
    };

    // Background
    $.fn.blurBlackground = function (options) {
        let _this = this;

        let defaults = {
            isShow: true,
            type: "water",
            target: null,
            targetname: "",
            isLoading: true
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let blur_bg_layout = $("#tiny-chat .blur-bg_layout");
            blur_bg_layout.data("targetname", settings.targetname);
            let loading = blur_bg_layout.find(".loading");
            settings.isLoading ? loading.show() : loading.hide();

            return blur_bg_layout;
        };

        return _this.init();
    };

    // Chat
    $.fn.chatBoxInput = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            return $("#tiny-chat .chat-box__input");
        };

        return _this.init();
    };

    $.fn.messageTextarea = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            return $("#tiny-chat #message-textarea");
        };

        return _this.init();
    };

    $.fn.loadingWaterLayout = function (options) {
        let _this = this;

        let defaults = {
            target: null,
            isShow: true
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let blurBlackground = $("#tiny-chat").blurBlackground();
            if (!$(".loading-water").length) {
                blurBlackground.loadingLayout({
                    type: "water",
                    target: settings.target,
                    isShow: settings.isShow
                });
            }

            return blurBlackground.show();
        };

        return _this.init();
    };
})(jQuery);

