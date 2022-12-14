import "/public/js/libraries/jquery-3.6.1.js";
import { CONF_APP } from "/public/js/config.js";

(function ($) {
    $.fn.resetClickBrand = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");

            let brand_id = settings.brand_id;

            let pre_chatinfo = $(".chatinfo.active");

            tiny_chat.resetClickChatInfo({
                brand_id,
                chatinfo_id: null,
                re_chatinfo_id: pre_chatinfo.data("id")
            });


            // chatBoxContent
            let chatBoxContent = tiny_chat.find(".chat-box__content");
            chatBoxContent.hide();
            let chatBoxView = chatBoxContent.find(".chat-box__content-list");
            chatBoxView.removeClass("active");
            chatBoxView.find(".chat-box__view")
                .removeClass("active")
                .hide();

            let currentChatBoxView = chatBoxContent.find(`.chat-box__content-list[data-id="${brand_id}"]`);
            currentChatBoxView.addClass("active");


            // listChatinfo 
            let listChatinfo = tiny_chat.find(".chat-info__list-chatinfo");
            listChatinfo.removeClass("active").hide();
            listChatinfo.find(".chatinfo")
                .removeClass("active")
                .show();

            let currentListChatinfo = $(`.chat-info__list-chatinfo[data-id="${brand_id}"]`);
            currentListChatinfo.addClass("active").scrollTop(0).show();

            tiny_chat.find("#search-chatinfo").val("");

            tiny_chat.find(".chat-box__banner").show();
        };

        return _this.init();
    };

    $.fn.resetClickChatInfo = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");

            let re_chatinfo_id = settings.re_chatinfo_id;
            let chatinfo_id = settings.chatinfo_id;
            let brand_id = settings.brand_id;

            // chatBoxContent
            let chatBoxContent = $(".chat-box__content");
            chatBoxContent.show();
            chatBoxContent.find(".chat-box__input").show();


            // ???n all chat box list
            let chatBoxView = chatBoxContent.find(".chat-box__content-list");
            chatBoxView.hide();

            let currentChatBoxView = chatBoxContent.find(`.chat-box__content-list[data-id="${brand_id}"]`);
            currentChatBoxView.show();

            tiny_chat.find(".chat-box__view")
                .removeClass("active")
                .hide();

            let currentchatBoxView = tiny_chat.find(`.chat-box__view[data-id="${chatinfo_id}"]`);
            let messages = currentchatBoxView.find(".message");
            if (!messages.length) {
                let empty = _this.add404({
                    target: currentchatBoxView,
                    image: CONF_APP.defaults.images.dataEmpty,
                    text: "H??y g???i m???t l???i ch??o ?????n ng?????i d??ng"
                });

                currentchatBoxView.append(empty);
            } else {
                _this.add404({
                    target: currentchatBoxView,
                    isEmpty: true
                });
            }
            currentchatBoxView.addClass("active").show();

            // C???p nh???t l???i th??ng b??o cho th????ng hi???u
            if (tiny_chat.checkNotSeen({
                chatinfo_id,
                brand_id
            })) {
                Chat.getInstance().sendUpdateSeenChatinfo({
                    chatinfo_id,
                    brand_id
                });
            }

            // C???p nh???t l???i th??ng b??o cho th????ng hi???u
            if (tiny_chat.checkNewMSG({
                chatinfo_id,
                brand_id
            })) {
                Chat.getInstance().sendSeen({
                    chatinfo_id,
                    brand_id
                });
            }

            tiny_chat.updateBrandNotification({
                brandID: brand_id,
            })

            // C???p nh???t scroll chat box
            tiny_chat.updateScrollBottomChatBoxView({ isAnimate: false });
            tiny_chat.updateMSGTime();

            tiny_chat.setMessageTextarea({
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

            // Focus input nh???p msg
            let inputSendMessage = $("#message-textarea");

            // Send socket typing
            // ????? tr?????c khi x??t inputSendMessage.data("chatinfo", chatinfo_id);
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