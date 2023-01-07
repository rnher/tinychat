import "/public/js/libraries/jquery-3.6.1.js";
import EmojiPicker from "/public/js/libraries/emojipicker.js";
import { CONF_CHAT } from "/public/js/config.js";

(function ($) {
    $.fn.submitSendMessage = function (options) {
        let _this = this;

        let defaults = {
            messageTextarea: _this.find("#message-textarea"),
            keyEnter: 13,
            keyBackspace: 8,
            maxHeight: 200,
            minHeight: 50, // 50px mặt định
            isSendTypping: false,
            prevTyppingStatus: true,
            prevChatID: null,
        };

        var settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Send socket typping
            _this.typing = function (chatinfo_id, key, message) {
                // Kết thúc khi enter hoặc không có ký tự nào
                if (key == settings.keyEnter || !message.val().length) {
                    if (settings.prevTyppingStatus) {
                        // Kết thúc nhập
                        settings.prevTyppingStatus = false;
                        settings.isSendTypping = false;
                    }
                } else {
                    if (!settings.prevTyppingStatus) {
                        // Bắt đầu nhập
                        settings.prevTyppingStatus = true;
                        settings.isSendTypping = false;
                    }
                }

                // Nếu chưa gửi thì gửi socket typping
                if (
                    chatinfo_id
                    && (!settings.isSendTypping || (settings.prevChatID != chatinfo_id))
                ) {
                    Chat.getInstance().sendTyping({
                        chatinfo_id,
                        typing: settings.prevTyppingStatus
                    });

                    settings.isSendTypping = true;
                    settings.prevChatID = chatinfo_id;
                }
            }

            // Gửi tin nhắn
            _this.sendMSG = function (chatinfo_id, message) {
                let content = message.val();
                if (content.length && content.trim()) {
                    // content = content.replace("\n", "");
                    Chat.getInstance().sendMessage({
                        type: CONF_CHAT.type.text,
                        content,
                        chatinfo_id
                    });
                }

                // Reset textarea
                message.val("");
                message.outerHeight(settings.minHeight);

                _this.toggleMessageButton(message);

                _this.updateCountMSG();
            }

            // Gửi hình ảnh
            _this.sendImages = function (chatinfo_id, images) {
                let content = images;

                Chat.getInstance().sendMessage({
                    type: CONF_CHAT.type.img,
                    content,
                    chatinfo_id
                });

                _this.updateCountMSG();
            }

            // Hiển thị send button khi có nội dung message
            _this.toggleMessageButton = function (message) {
                let content = message.val();

                if (content.length && content.trim()) {
                    _this.find(".btn-submit").show();
                } else {
                    _this.find(".btn-submit").hide();
                }
            }

            // Khởi tạo chiều cao ban đầu của Textare khi tin nhắn rỗng
            _this.resetMessageTextareaHeight = function (message) {
                if (message.val().length == 1 || message.val().length == 0) {
                    message.outerHeight(settings.minHeight);
                }
            }

            // Khởi tạo chiều cao ban đầu của Textare khi tin nhắn rỗng
            _this.resizeMessageTextarea = function (message, messageTextarea) {
                while (message.innerHeight() < settings.maxHeight
                    && message.innerHeight() < messageTextarea.scrollHeight) {

                    message.innerHeight(message.innerHeight() + 1);
                };
            }

            settings.messageTextarea.on("keyup", function (e) {
                let message = $(this);
                let chatinfo_id = message.data("chatinfo");

                let key = e.which || e.keyCode || 0;

                let checkMaxMsg = !_this.updateCountMSG();

                switch (key) {
                    // Khi enter
                    case settings.keyEnter: {
                        // SEND socket dành cho Enter
                        e.preventDefault();

                        if (!checkMaxMsg) {
                            _this.sendMSG(chatinfo_id, message);
                        }
                    }
                        break;
                    // Khi delete
                    case settings.keyBackspace: {
                        // Reset height
                        _this.resetMessageTextareaHeight(message);
                    }
                        break;
                    default: {
                        // Resize
                        _this.resizeMessageTextarea(message, this)
                        // Reset height
                        _this.resetMessageTextareaHeight(message);
                    }
                        break;
                }

                // Send socket typping
                _this.typing(chatinfo_id, key, message);
                // Hiển thị send button khi có nội dung message
                _this.toggleMessageButton(message);
            });

            settings.messageTextarea.on("focusout", function (e) {
                e.preventDefault();

                let message = $(this);
                let chatinfo_id = message.data("chatinfo");
                _this.typing(chatinfo_id, null, message);
            });

            settings.messageTextarea.on("focusin", function (e) {
                e.preventDefault();

                let message = $(this);
                let chatinfo_id = message.data("chatinfo");
                _this.typing(chatinfo_id, null, message);
            });

            // SEND socket dành cho button
            _this.submit(function (e) {
                e.preventDefault();

                let message = settings.messageTextarea;
                let chatinfo_id = message.data("chatinfo");

                _this.sendMSG(chatinfo_id, message);
            });

            // Init EmojiPicker
            new EmojiPicker({
                trigger: [{
                    selector: "#item-bar__emoji",
                    insertInto: "#message-textarea",
                }],
                closeButton: true,
            });

            // Init Input image
            $("#item-bar__input-image").changeMessageImages({
                callback: (images) => {
                    // SEND socket dành cho input image
                    let message = settings.messageTextarea;
                    let chatinfo_id = message.data("chatinfo");

                    _this.sendImages(chatinfo_id, images);
                }
            });
            $("#item-bar__image").on("click", function (e) {
                e.preventDefault();

                let target = $(this).data("target");
                let input = $("#" + target);
                input.trigger("click");
            });
        };

        return _this.init();
    };

    $.fn.loadMessages = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.get({
                url: settings.url,
                success: function (data) {
                    let items = data.items;

                    let chatBoxView = $(".chat-box__view[data-id=" + data.chatinfo_id + "]");
                    chatBoxView.data("next", data.next_page_url);

                    for (let i = 0; i < items.length; i++) {
                        chatBoxView.prepend($(chatBoxView).createMessageItem({ data: items[i] }));
                    }

                    chatBoxView.uploadLayoutMessage({
                        chatinfo_id: data.chatinfo_id
                    });

                    if (typeof settings.callback == "function") {
                        settings.callback(data);
                    }
                },
                reject: function (error) {
                    if (typeof settings.callback == "function") {
                        settings.callback(null, error);
                    }
                }
            });
        };

        return _this.init();
    }

    $.fn.onScrollExtraMessagers = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let isSuccessLoad = true;
            let chatinfoMessagesEnd = [];

            _this.on("scroll", function (e) {
                e.preventDefault();
                let tinyChat = $("#tiny-chat");

                let chatBoxView = $(this);

                // Toggle button movedow
                chatBoxView.checkBottomScrollMessage({
                    success: () => {
                        tinyChat.find("#chat-box__move-down").hide();
                        tinyChat.find(".chat-box__content .new-msg-badge").remove();
                    },
                    reject: () => {
                        tinyChat.find("#chat-box__move-down").show();
                    }
                });

                // Kiểm tra trước đó đã hết tin nhắn
                let massegesEnd = chatinfoMessagesEnd.find((value) => {
                    chatBoxView.data("id") == value;
                });

                // Hoàn thành load và vẫn còn tin nhắn chưa được load
                if (isSuccessLoad && !massegesEnd) {
                    let messages = chatBoxView.find(".message");
                    let itemHeight = $(messages).first().outerHeight();

                    // Top
                    if (chatBoxView.scrollTop() <= itemHeight) {
                        let url = chatBoxView.data("next");
                        if (url) {
                            isSuccessLoad = false;

                            // Add loading message
                            let loading = $(tinyChat.createLoader({
                                type: "message",
                                color: "success"
                            }));
                            chatBoxView.prepend(loading);

                            chatBoxView.loadMessages({
                                url,
                                callback: (data, error) => {
                                    isSuccessLoad = true;

                                    // Remove loading message
                                    loading.remove();

                                    if (data) {
                                        tinyChat.updateScrollPreTopChatBoxView({
                                            extraLength: data.items.length
                                        });

                                        if (!data.next_page_url) {
                                            let outOfData = chatBoxView.find(".out-of-data");
                                            if (!outOfData.length) {
                                                chatBoxView.prepend(tinyChat.createOutOfData({ type: "message" }));
                                                chatinfoMessagesEnd.push(chatBoxView.data("id"));
                                            }
                                        }

                                        tinyChat.updateMSGTime();
                                    }
                                }
                            });
                        }
                    }
                }
            })

        };

        return _this.init();
    };

    $.fn.onClickMoveDowMessage = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("click", function (e) {
                e.preventDefault();

                $(this).updateScrollBottomChatBoxView();
            });
        };

        return _this.init();
    }

    $.fn.uploadLayoutMessage = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // let brand_id = settings.brand_id;
            let chatinfo_id = settings.chatinfo_id;

            let clientTinyChat = $(`.chat-box__view[data-id="${chatinfo_id}"]`);
            let messages = clientTinyChat.find(".message");

            for (let i = 0; i < messages.length; i++) {
                let pre_message = $(messages[i - 1]);
                let message = $(messages[i]);
                let next_message = $(messages[i + 1]);

                if (!pre_message || !next_message) {
                    continue;
                }

                let pre_message_user = pre_message.find(".message-user");
                // Có createTypingMessage đứng trước nên cần loại bỏ
                if (pre_message_user.data("pseudo") == 1) {
                    pre_message = $(messages[i - 2]);
                    pre_message_user = pre_message.find(".message-user");
                }

                let message_user = message.find(".message-user");
                let next_message_user = next_message.find(".message-user");

                if (pre_message_user.data("id") == message_user.data("id")) {
                    message_user.css("visibility", "hidden");
                    // pre_message.find(".content-info").hide();

                    if (next_message_user.data("id") == message_user.data("id")) {
                        // message.find(".content-info").hide();
                    }
                }
            }
        };

        return _this.init();
    };

    $.fn.checkBottomScrollMessage = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Thông báo hết tin
            let outOfData = _this.find(".out-of-data");
            let outOfDataHeight = outOfData.length ? $(outOfData).first().outerHeight() : 0;

            // Tin nhắn
            let messages = _this.find(".message");

            // Tổng
            let scrollTopHieght = _this.outerHeight() + _this.scrollTop();
            let totalHeight = outOfData.length * outOfDataHeight;
            messages.each(function () {
                totalHeight += $(this).outerHeight();
            });

            let dateLabels = _this.find(".chat-box-view__date-label");
            dateLabels.each(function (index, value) {
                totalHeight += $(this).outerHeight();
            });

            let heightPadd = messages.length ? $(messages[messages.length - 1]).outerHeight() : 100;

            if (Math.round(scrollTopHieght) >= (Math.round(totalHeight) - heightPadd)) {
                if (typeof settings.success == "function") {
                    settings.success();
                }
            } else {
                if (typeof settings.reject == "function") {
                    settings.reject();
                }
            }
        };

        return _this.init();
    }
})(jQuery);
