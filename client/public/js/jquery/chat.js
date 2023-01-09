import "/client/public/js/services/rsa.js";
import { CONF_URL, CONF_SOCKET } from "/client/public/js/config.js";
import { formatNoticationNumber } from "/client/public/js/util.js";

(function ($) {
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

    $.fn.submitRegisterChat = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("submit", function (e) {
                e.preventDefault();

                _this.disabledInput();

                let token = $("#client-tiny-chat-script").data("id");

                _this.ajaxForm({
                    fields: ["name", "phone", "mail"],
                    url: CONF_URL.clients,
                    params: {
                        token
                    },
                    success: function (data) {
                        _this.endabaleInput();

                        let client_tiny_chat = $("#client-tiny-chat");

                        // Lưu id để client truy cập lần sau
                        if (typeof (Storage) !== "undefined") {
                            if (window.remember) {
                                window.remember = localStorage;
                            } else {
                                window.remember = sessionStorage;
                            }

                            window.remember.setItem(token, data.ssid);
                        } else {
                            // TODO: Sorry! No Web Storage support..
                        }

                        // Lưu id để đăng nhập socket
                        // Kết nối socket khi đăng ký thành công
                        Chat.getInstance(data.ssid, (chat) => {
                            chat.sendAddChatInfo({
                                customer_id: data.customer_id
                            })
                        });

                        client_tiny_chat.find(".register-chat").remove();

                        //TODO: add layout loading

                        client_tiny_chat.getAjax({
                            url: CONF_URL.clients,
                            params: {
                                token,
                                ssid: window.remember ? window.remember.getItem(token) : null
                            },
                            success: (data) => {
                                client_tiny_chat.startChat({ data });

                                //TODO: remove layout loading
                            },
                            reject: function (error) {
                                client_tiny_chat
                                    .append(client_tiny_chat
                                        .createRegisterChat({ data: error }));
                                client_tiny_chat.find("#register-chat__form").submitRegisterChat();


                                //TODO: remove layout loading
                            }
                        });
                    },
                    reject: function (error) {
                        _this.endabaleInput();
                        let client_tiny_chat = $("#client-tiny-chat");

                        // Brand không tồn tại hoặc hết hạn
                        client_tiny_chat.find(".register-content").showError({ error });
                    }
                })
            });
        };

        return _this.init();
    };

    $.fn.initChatBox = function (options) {
        let _this = this;

        let defaults = {
            isShow: false
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let client_tiny_chat = $("#client-tiny-chat");

            // Display new smg
            _this.updateMSGNotication({
                value: settings.data.count_not_seen
            });

            let chatBox = client_tiny_chat.createChatBox(settings.data);
            client_tiny_chat.append(chatBox);

            let messages = settings.data.items;
            for (let i = 0; i < messages.length; i++) {
                let chatBoxView = $(".chat-box__view[data-id=" + settings.data.chatinfo.id + "]");
                chatBoxView.prepend($(chatBoxView).createMessageItem({ data: messages[i] }))
            }

            client_tiny_chat.uploadLayoutMessage({
                chatinfo_id: settings.data.chatinfo.id
            });

            // Ẩn nó khi mới khỏi tạo. Sẽ được hiển thị khi chạy updateScrollBottomChatBoxView
            let chatBoxMoveDown = client_tiny_chat.find("#chat-box__move-down");
            chatBoxMoveDown.hide();
            chatBoxMoveDown.onClickMoveDowMessage();

            // Load customer đồ họa
            _this.reloadLayoutChat({
                data: settings.data.brand.settings,
                isInit: true
            });

            if (settings.isShow) {
                client_tiny_chat.find(".chat-box").show()
            } else {
                client_tiny_chat.find(".chat-box").hide()
            }

            // Bât cái này Nếu chat hiển thị mặc định thì update scroll
            client_tiny_chat.updateScrollBottomChatBoxView({ isAnimate: false });
        };

        return _this.init();
    };

    $.fn.updateScrollBottomChatBoxView = function (options) {
        let _this = this;

        let defaults = {
            isAnimate: true
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let chatBoxView = $(".chat-box__view:visible");

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
        };

        return _this.init();
    }

    $.fn.reloadLayoutChat = function (options) {
        let _this = this;

        let defaults = {
            isInit: false,
            isSelect: false,
            isReload: false
        };

        let settings = $.extend({}, defaults, options);

        _this.processReload = function (
            data,
            brand_name_color,
            brand_text_color,
            brand_chat_color,
            brand_chat_bg,
            client_chat_color,
            client_chat_bg,
            main_color,
            main_bg,
            // TODO:
            // main_text,
            // main_icon,
            chat_bg
        ) {
            if (data.brand_name_color) {
                brand_name_color;
            }
            if (data.brand_text_color) {
                brand_text_color;
            }

            if (data.brand_chat_color) {
                brand_chat_color;
            }
            if (data.brand_chat_bg) {
                brand_chat_bg;
            }

            if (data.client_chat_color) {
                client_chat_color;
            }
            if (data.client_chat_bg) {
                client_chat_bg;
            }

            if (data.main_color) {
                main_color;
            }
            if (data.main_bg) {
                main_bg;
            }
            // TODO
            // if (data.main_text) {
            //     main_text;
            // }
            // if (data.main_icon) {
            //     main_icon;
            // }

            if (data.chat_bg) {
                chat_bg;
            }
        }
        _this.init = function () {
            let data = settings.data;
            let client = $("#client-tiny-chat");

            if (settings.isReload) {
                data = {
                    brand_name_color: client.find(".edit-brand-name-color")
                        .data("selectcolor"),
                    brand_text_color: client.find(".edit-brand-text-color")
                        .data("selectcolor"),
                    brand_chat_color: client.find(".edit-brand-content")
                        .data("selectcolor"),
                    brand_chat_bg: client.find(".edit-brand-content")
                        .data("selectbg"),
                    client_chat_color: client.find(".edit-customer-content")
                        .data("selectcolor"),
                    client_chat_bg: client.find(".edit-customer-content")
                        .data("selectbg"),
                    main_bg: client.find(".edit-main")
                        .data("selectbg"),
                    main_color: client.find(".edit-main")
                        .data("selectcolor"),
                    // TODO:
                    // main_text: client.find(".edit-main")
                    //     .data("selecttext"),
                    // main_icon: client.find(".edit-main")
                    //     .data("selecticon"),
                    chat_bg: client.find(".edit-chat-bg")
                        .data("selectbg"),
                };
            }

            _this.processReload(
                data,
                client.find(".brand_name_color").css("color", data.brand_name_color),
                client.find(".brand_text_color").css("color", data.brand_text_color),
                client.find(".brand_chat_color").css("color", data.brand_chat_color),
                client.find(".brand_chat_bg").css("background-color", data.brand_chat_bg),
                client.find(".client_chat_color").css("color", data.client_chat_color),
                client.find(".client_chat_bg").css("background-color", data.client_chat_bg),
                client.find(".main_bg").css("background-color", data.main_bg),
                client.find(".main_color").css("color", data.main_color),
                // TODO:
                // client.find(".main_text").text(data.main_text),
                // client.find(".main_icon").empty().append($(data.main_icon)),
                client.find(".chat_bg").css("background-color", data.chat_bg),
            );

            if (settings.isInit) {
                _this.processReload(
                    data,
                    client.find(".edit-brand-name-color")
                        .data("color", data.brand_name_color),
                    client.find(".edit-brand-text-color")
                        .data("color", data.brand_text_color),
                    client.find(".edit-brand-content")
                        .data("color", data.brand_chat_color),
                    client.find(".edit-brand-content")
                        .data("bg", data.brand_chat_bg),
                    client.find(".edit-customer-content")
                        .data("color", data.client_chat_color),
                    client.find(".edit-customer-content")
                        .data("bg", data.client_chat_bg),
                    client.find(".edit-main")
                        .data("color", data.main_color),
                    client.find(".edit-main")
                        .data("bg", data.main_bg),
                    // TODO:
                    // client.find(".edit-main")
                    //     .data("text", data.main_text),
                    // client.find(".edit-main")
                    //     .data("icon", data.main_icon),
                    client.find(".edit-chat-bg")
                        .data("bg", data.chat_bg),
                );
            }

            if (settings.isSelect || settings.isInit) {
                _this.processReload(
                    data,
                    client.find(".edit-brand-name-color")
                        .data("selectcolor", data.brand_name_color),
                    client.find(".edit-brand-text-color")
                        .data("selectcolor", data.brand_text_color),
                    client.find(".edit-brand-content")
                        .data("selectcolor", data.brand_chat_color),
                    client.find(".edit-brand-content")
                        .data("selectbg", data.brand_chat_bg),
                    client.find(".edit-customer-content")
                        .data("selectcolor", data.client_chat_color),
                    client.find(".edit-customer-content")
                        .data("selectbg", data.client_chat_bg),
                    client.find(".edit-main")
                        .data("selectcolor", data.main_color),
                    client.find(".edit-main")
                        .data("selectbg", data.main_bg),
                    //TODO:
                    // client.find(".edit-main")
                    //     .data("selecttext", data.main_text),
                    // client.find(".edit-main")
                    //     .data("selecticon", data.main_icon),
                    client.find(".edit-chat-bg")
                        .data("selectbg", data.chat_bg),
                );
            }
        };

        return _this.init();
    };

    $.fn.updateMSGNotication = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            if (settings.value != 0) {
                let badgeNewMSG = $(".chat-bubble").find(".badge-new-msg");
                let objNum = formatNoticationNumber(settings.value, 0);
                badgeNewMSG.data("value", objNum.num);
                badgeNewMSG.text(objNum.display);

                badgeNewMSG.show();
            }
        };

        return _this.init();
    }

    $.fn.onClickMiniSize = function (options) {
        let _this = this;

        let defaults = {
            target: "#chat-box"
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("click", function (e) {
                e.preventDefault();

                let chatBox = $(settings.target);
                chatBox.hide();
            });
        };

        return _this.init();
    }

    $.fn.updateCountMSG = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let client_tiny_chat = $("#client-tiny-chat");
            let viewCountMessage = client_tiny_chat.find(".view-count-message");

            let maxCount = viewCountMessage.find(".max-count-message");
            let maxValue = maxCount.data("value");
            // maxCount.empty().text(maxValue);

            let currentLength = client_tiny_chat.find("#message-textarea").val().length;
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

    $.fn.onClickCheckRemember = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.find("#remember").on("change", function (e) {
                e.preventDefault();

                window.remember = this.checked;
            });
        };

        return _this.init();
    }

    $.fn.startChat = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let data = settings.data;

            let client_tiny_chat = $("#client-tiny-chat");

            client_tiny_chat.find(".chat-bubble").removeClass("chat-bubble__register");

            RSA.getInstance().add(
                data.chatinfo.id,
                data.chatinfo.public_key,
                data.chatinfo.private_key
            );

            Chat.getInstance(data.ssid, (socket) => {
            });

            client_tiny_chat.initChatBox({
                data,
                isShow: true
            });
            client_tiny_chat.find(".chat-box__view").onScrollExtraMessagers();
            client_tiny_chat.find("#send-message__form").submitSendMessage();

            client_tiny_chat.find("#mini-size-chat").onClickMiniSize();
            client_tiny_chat.find("#notification-sound").onClickNotificationSound();
            client_tiny_chat.find("#delete-chat").onClickDeleteChat();

            client_tiny_chat.onClickAction({
                selector: ".chat-bubble",
                callback: () => {
                    // Nếu chat hidden cần nhấn để hiển thị
                    client_tiny_chat.updateScrollBottomChatBoxView({ isAnimate: false });
                    client_tiny_chat.seenMessage({
                        chatinfo_id: data.chatinfo.id,
                        brand_id: data.brand.id,
                    });
                }
            });

            client_tiny_chat.updateMSGTime()

            setInterval(
                client_tiny_chat.updateMSGTime,
                CONF_SOCKET.pingTime
            );
        };

        return _this.init();
    }

    $.fn.onClickDeleteChat = function (options) {
        let _this = this;

        let defaults = {
            token: $("#client-tiny-chat-script").data("id")
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("click", function (e) {
                e.preventDefault();

                localStorage.clear(settings.token);
                sessionStorage.clear(settings.token);
                window.reloadchat();
            });
        };

        return _this.init();
    }
})(jQuery);
