import "/public/js/libraries/jquery-3.6.1.js";

(function ($) {
    $.fn.updateScrollBottomChatBoxView = function (options) {
        let _this = this;

        let defaults = {
            isAnimate: true
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");

            let chatBoxView = tiny_chat.find(".chat-box__view:visible");

            let messages = chatBoxView.find(".message");
            let outOfData = chatBoxView.find(".out-of-data");
            let dateLabels = chatBoxView.find(".chat-box-view__date-label");

            let scrollTop = 0;

            dateLabels.each(function (index, value) {
                scrollTop += $(value).outerHeight();
            });

            messages.each(function (index, value) {
                scrollTop += $(value).outerHeight();
            });

            if (outOfData.length) {
                scrollTop += outOfData.outerHeight();
            }

            if (settings.isAnimate) {
                chatBoxView.animate({ scrollTop }, 200, "swing");
            } else {
                chatBoxView.scrollTop(scrollTop);
            }

            tiny_chat.find("#chat-box__move-down").hide();
        };

        return _this.init();
    }

    $.fn.updateScrollPreTopChatBoxView = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let chatBoxView = $(".chat-box__view:visible");
            let extraLength = settings.extraLength;

            if (extraLength) {
                let perHeight = chatBoxView.prop("scrollHeight") / chatBoxView.find(".message").length;
                let preHeight = perHeight * extraLength;

                chatBoxView.scrollTop(preHeight);
            }
        };

        return _this.init();
    }

    $.fn.updateCountMSG = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");
            let viewCountMessage = tiny_chat.find(".view-count-message");

            let maxCount = viewCountMessage.find(".max-count-message");
            let maxValue = maxCount.data("value");
            // maxCount.empty().text(maxValue);

            let currentLength = tiny_chat.find("#message-textarea").val().length;
            let curCount = viewCountMessage.find(".current-count-message");
            curCount.data("value", currentLength);
            curCount.empty().text(currentLength);

            if (maxValue < currentLength) {
                viewCountMessage.addClass("label-error");
                return false;
            } else {
                viewCountMessage.removeClass("label-error");
                return true;
            }
        };

        return _this.init();
    }
})(jQuery);
