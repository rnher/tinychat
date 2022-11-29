(function ($) {
    $.fn.submitSendMessage = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("keydown", function (e) {
                let message = $(this);
                let key = e.which || e.keyCode || 0;
                let keyEnter = 13;
                let keyBackspace = 8;
                let maxHeight = 200;
                let minHeight = 50; // 50px mặt định

                switch (key) {
                    case keyEnter: {
                        e.preventDefault();

                        let msg = message.val();
                        let chatinfo_id = message.data("chatinfo");

                        if (msg.length) {
                            Chat.getInstance().sendMessage({
                                msg,
                                chatinfo_id
                            });
                        }

                        // Reset textarea
                        message.val("");
                        message.outerHeight(minHeight);
                    }
                        break;
                    case keyBackspace: {
                        // FIXME: resize 
                        // Xóa hết không trả về size default phải nhấn thêm 1 ký tự
                        // Pass 1 đoạn tin nhắn vào không size max phải nhấn thêm 1 ký tự

                        if (message.val().length == 1 || message.val().length == 0) {
                            message.outerHeight(minHeight);
                        }
                    }
                        break;
                    default: {
                        while (message.innerHeight() < maxHeight
                            && message.innerHeight() < this.scrollHeight) {

                            message.innerHeight(message.innerHeight() + 1);
                        };

                        // FIXME: resize
                        // while (
                        //     message.innerHeight() > minHeight
                        //     && message.innerHeight() > this.scrollHeight) {

                        //     message.innerHeight(message.innerHeight() - 1);
                        // };

                        if (message.val().length == 1 || message.val().length == 0) {
                            message.outerHeight(minHeight);
                        }
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

                    let chatBoxView = $(".chat-box__view[data-id=" + data.chatinfo_id + "]");

                    for (let i = 0; i < items.length; i++) {
                        chatBoxView.prepend($(chatBoxView).createMessageItem({ data: items[i] }));
                    }

                    chatBoxView.data("next", data.next_page_url);

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

    $.fn.updateScrollBottomChatBoxView = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let chatBoxView = $(".chat-box__view:visible");

            let messages = chatBoxView.find(".message");
            if (messages.length) {
                chatBoxView.scrollTop((messages.length) * messages.first().outerHeight());
            } else {
                chatBoxView.scrollTop(0);
            }
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
                    let itemHeight = $(messages).first().outerHeight();

                    // Top
                    if (chatBoxView.scrollTop() <= itemHeight) {
                        let url = chatBoxView.data("next");

                        if (url) {
                            isSuccessLoad = false;

                            chatBoxView.loadMessages({
                                url,
                                callback: (data, error) => {
                                    isSuccessLoad = true;

                                    if (data) {
                                        $("#tiny-chat").updateScrollPreTopChatBoxView({
                                            extraLength: data.items.length
                                        });

                                        if (!data.next_page_url) {
                                            let outOfData = chatBoxView.find(".out-of-data");
                                            if (!outOfData.length) {
                                                chatBoxView.prepend($("#tiny-chat").createOutOfData({ type: "message" }));
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
            let scrollTopHieght = _this.outerHeight() + _this.scrollTop() + messageHeight;
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
})(jQuery);
