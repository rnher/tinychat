import { CONF_URL, CONF_SOCKET } from "/client/public/js/config.js";

(function ($) {
    $.fn.submitSendMessage = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Fix xuất hiện khoảng trắng khi khởi tạo
            _this.val("");

            _this.on("keydown", function (e) {
                let message = $(this);
                let key = e.which || e.keyCode || 0;
                let keyEnter = 13;

                switch (key) {
                    case keyEnter: {
                        e.preventDefault();

                        let content = message.val();
                        let chatinfo_id = message.data("chatinfo");

                        if (content.length) {
                            Chat.getInstance().sendMessage({
                                content,
                                chatinfo_id
                            });
                        }

                        // Reset textarea
                        message.val("");
                    }
                        break;
                    default: {
                    }
                        break;
                }
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

                    for (let i = 0; i < items.length; i++) {
                        let chatBoxView = $(".chat-box__view[data-id=" + data.chatinfo_id + "]");
                        chatBoxView
                            .prepend($(chatBoxView).createMessageItem({ data: items[i] }))
                            .data("next", data.next_page_url);
                    }

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

    $.fn.updateScrollPreTopChatBoxView = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let chatBoxView = $(".chat-box__view");
            let extraLength = settings.extraLength;

            if (extraLength) {
                let perHeight = chatBoxView.prop("scrollHeight") / chatBoxView.find(".message").length;
                let preHeight = perHeight * extraLength;

                chatBoxView.scrollTop(preHeight);
            }
        };

        return _this.init();
    }

    $.fn.onScrollExtraMasegers = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let isSuccessLoad = true;
            let chatinfoMessagesEnd = [];

            _this.on("scroll", function (e) {
                e.preventDefault();

                let chatBoxView = $(this);

                // Toggle button movedow
                chatBoxView.checkBottomScrollMessage({
                    success: () => {
                        $("#chat-box__move-down").hide();
                    },
                    reject: () => {
                        $("#chat-box__move-down").show();
                    }
                });

                // Kiểm tra trước đó đã hết tin nhắn
                let messagesEnd = chatinfoMessagesEnd.find((value) => {
                    chatBoxView.data("id") == value;
                });

                // Hoàn thành load và vẫn còn tin nhắn chưa được load
                if (isSuccessLoad && !messagesEnd) {
                    let messages = chatBoxView.find(".message");
                    let messageHeight = $(messages).first().outerHeight();

                    // Top vừa tới itemHeight
                    if (chatBoxView.scrollTop() <= messageHeight) {
                        let url = chatBoxView.data("next");
                        if (url) {
                            isSuccessLoad = false;

                            chatBoxView.loadMessages({
                                url,
                                callback: (data, error) => {
                                    isSuccessLoad = true;

                                    if (data) {
                                        $("#client-tiny-chat").updateScrollPreTopChatBoxView({
                                            extraLength: data.items.length
                                        });

                                        if (!data.next_page_url) {
                                            let outOfData = chatBoxView.find(".out-of-data");
                                            if (!outOfData.length) {
                                                chatBoxView.prepend($("#client-tiny-chat").createOutOfData({ type: "message" }));
                                                chatinfoMessagesEnd.push(chatBoxView.data("id"));
                                            }
                                        }
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

    $.fn.submitRegisterChat = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("submit", function (e) {
                e.preventDefault();

                _this.disabledInput();

                _this.ajaxForm({
                    fields: ["name", "phone"],
                    url: CONF_URL.clients + "?token=" + $("#client-tiny-chat-script").data("id"),
                    success: function (data) {
                        _this.endabaleInput();

                        // Lưu id để đăng nhập socket
                        // Kết nối socket khi đăng ký thành công
                        Chat.getInstance(data.ssid, (chat) => {
                            chat.sendAddChatInfo({
                                customer_id: data.customer_id
                            })
                        });

                        $(".register-chat").remove();
                        //TODO: add layout loading

                        $("#client-tiny-chat").ajaxForm({
                            method: "GET",
                            url: CONF_URL.clients + "?token=" + $("#client-tiny-chat-script").data("id"),
                            success: function (data) {
                                $("#client-tiny-chat").initChatBox({ data });
                                $(".chat-box__view").onScrollExtraMasegers();
                                $("#message-textarea").submitSendMessage();
                                setInterval(
                                    $("#client-tiny-chat").updateMSGTime
                                    , CONF_SOCKET.pingTime
                                );

                                // Send seen and update croll
                                $("#client-tiny-chat").onClickAction({
                                    selector: ".chat-bubble",
                                    callback: function () {
                                        // Nếu chat hidden cần nhấn để hiển thị
                                        $("#client-tiny-chat").updateScrollBottomChatBoxView();
                                        $("#client-tiny-chat").seenMessage({
                                            chatinfo_id: data.chatinfo_id
                                        })

                                        $("#client-tiny-chat #chat-box").toggle();
                                    }
                                });


                                //TODO: remove layout loading
                            },
                            reject: function (error) {
                                $("#client-tiny-chat")
                                    .append($("#client-tiny-chat").createRegisterChat());
                                $("#register-chat__form").submitRegisterChat();

                                //TODO: remove layout loading
                            }
                        });
                    },
                    reject: function (error) {
                        _this.endabaleInput();

                        // Brand không tồn tại hoặc hết hạn
                        $(".register-content").showError({ error });
                    }
                })
            });
        };

        return _this.init();
    };

    $.fn.initChatBox = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $("#client-tiny-chat").append($("#client-tiny-chat").createChatBox(settings.data));

            let messages = settings.data.items;
            for (let i = 0; i < messages.length; i++) {
                let chatBoxView = $(".chat-box__view[data-id=" + settings.data.chatinfo_id + "]");
                chatBoxView.prepend($(chatBoxView).createMessageItem({ data: messages[i] }))
            }

            // Ẩn nó khi mới khỏi tạo. Sẽ được hiển thị khi chạy updateScrollBottomChatBoxView
            $("#chat-box__move-down").hide();

            // Bât cái này Nếu chat hiển thị mặc định thì update scroll
            $("#client-tiny-chat").updateScrollBottomChatBoxView();
            $("#chat-box__move-down").onClickMoveDowMessage();
        };

        return _this.init();
    };

    $.fn.updateScrollBottomChatBoxView = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let chatBoxView = $(".chat-box__view");

            let messages = chatBoxView.find(".message");

            if (messages.length) {
                chatBoxView.scrollTop((messages.length) * messages.first().outerHeight());
            } else {
                chatBoxView.scrollTop(0);
            }
        };

        return _this.init();
    }

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
            let messageHeight = $(messages).first().outerHeight();

            // Tổng
            let scrollTopHieght = _this.innerHeight() + _this.scrollTop() + messageHeight;
            let totalHeight = messages.length * messageHeight + outOfData.length * outOfDataHeight;

            if (Math.round(scrollTopHieght) >= Math.round(totalHeight)) {
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

    $.fn.seenMessage = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Gửi thông báo đã xem
            Chat.getInstance().sendSeen({
                chatinfo_id: settings.chatinfo_id
            });

            // Cập nhật thông báo về 0 và ẩn
            let badgeNewMSG = $(".chat-bubble")
                .find(".badge-new-msg")
                .data("value", 0)
                .text(0)
                .hide();
        };

        return _this.init();
    }
})(jQuery);
