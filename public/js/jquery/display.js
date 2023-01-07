import "/public/js/libraries/jquery-3.6.1.js";
import { CONF_APP } from "/public/js/config.js";

(function ($) {
    $.fn.resetClickBrand = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tinyChat = $("#tiny-chat");

            let brand_id = settings.brand_id;

            let pre_chatinfo = $(".chatinfo.active");

            tinyChat.resetClickChatInfo({
                brand_id,
                chatinfo_id: null,
                re_chatinfo_id: pre_chatinfo.data("id")
            });


            // chatBoxContent
            let chatBoxContent = tinyChat.find(".chat-box__content");
            chatBoxContent.hide();
            let chatBoxView = chatBoxContent.find(".chat-box__content-list");
            chatBoxView.removeClass("active");
            chatBoxView.find(".chat-box__view")
                .removeClass("active")
                .hide();

            let currentChatBoxView = chatBoxContent.find(`.chat-box__content-list[data-id="${brand_id}"]`);
            currentChatBoxView.addClass("active");


            // listChatinfo 
            let listChatinfo = tinyChat.find(".chat-info__list-chatinfo");
            listChatinfo.removeClass("active").hide();
            listChatinfo.find(".chatinfo")
                .removeClass("active")
                .show();

            let currentListChatinfo = $(`.chat-info__list-chatinfo[data-id="${brand_id}"]`);
            currentListChatinfo.addClass("active").scrollTop(0).show();

            tinyChat.find("#search-chatinfo").val("");
        };

        return _this.init();
    };

    $.fn.resetClickChatInfo = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tinyChat = $("#tiny-chat");

            let re_chatinfo_id = settings.re_chatinfo_id;
            let chatinfo_id = settings.chatinfo_id;
            let brand_id = settings.brand_id;

            // chatBoxContent
            let chatBoxContent = $(".chat-box__content");
            chatBoxContent.show();
            chatBoxContent.find(".chat-box__input").show();


            // Ẩn all chat box list
            let chatBoxView = chatBoxContent.find(".chat-box__content-list");
            chatBoxView.hide();

            let currentChatBoxView = chatBoxContent.find(`.chat-box__content-list[data-id="${brand_id}"]`);
            currentChatBoxView.show();

            tinyChat.find(".chat-box__view")
                .removeClass("active")
                .hide();

            let currentchatBoxView = tinyChat.find(`.chat-box__view[data-id="${chatinfo_id}"]`);
            let messages = currentchatBoxView.find(".message");
            if (!messages.length) {
                let empty = _this.add404({
                    target: currentchatBoxView,
                    image: CONF_APP.defaults.images.dataEmpty,
                    text: "Hãy gửi một lời chào đến người dùng"
                });

                currentchatBoxView.append(empty);
            } else {
                _this.add404({
                    target: currentchatBoxView,
                    isEmpty: true
                });
            }
            currentchatBoxView.addClass("active").show();

            // Cập nhật lại thông báo cho thương hiệu
            if (tinyChat.checkNotSeen({
                chatinfo_id,
                brand_id
            })) {
                Chat.getInstance().sendUpdateSeenChatinfo({
                    chatinfo_id,
                    brand_id
                });
            }

            // Cập nhật lại thông báo cho thương hiệu
            if (tinyChat.checkNewMSG({
                chatinfo_id,
                brand_id
            })) {
                Chat.getInstance().sendSeen({
                    chatinfo_id,
                    brand_id
                });
            }

            tinyChat.updateBrandNotification({
                brandID: brand_id,
            })

            // Cập nhật scroll chat box
            tinyChat.updateScrollBottomChatBoxView({ isAnimate: false });
            tinyChat.updateMSGTime();


            tinyChat.setMessageTextarea({
                brand_id,
                chatinfo_id,
                re_chatinfo_id
            });
        };

        return _this.init();
    };

    $.fn.setMessageTextarea = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let chatinfo_id = settings.chatinfo_id;
            let re_chatinfo_id = settings.re_chatinfo_id;
            let brand_id = settings.brand_id;

            // Focus input nhập msg
            let inputSendMessage = $("#message-textarea");

            // Send socket typing
            // Để trước khi xét inputSendMessage.data("chatinfo", chatinfo_id);
            if (re_chatinfo_id) {
                Chat.getInstance().sendTyping({
                    chatinfo_id: re_chatinfo_id,
                    typing: false
                });
            }

            inputSendMessage.data("brand", brand_id);
            inputSendMessage.data("chatinfo", chatinfo_id);
            inputSendMessage.val("");
            inputSendMessage.updateCountMSG();
            inputSendMessage.trigger("focus");
        };

        return _this.init();
    };
})(jQuery);