import "/public/js/libraries/jquery-3.6.1.js";
import { CONF_URL, CONF_SOCKET } from "/public/js/config.js";

(function ($) {
    $.fn.submitCreateBrand = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("submit", function (e) {
                e.preventDefault();

                _this.disabledInput();
                _this.ajaxForm({
                    fields: ["name", "description"],
                    url: CONF_URL.brands,
                    success: function (response) {
                        $("#tiny-chat").go(CONF_URL.home);
                    },
                    reject: function (error) {
                        _this.endabaleInput();

                        $("#tiny-chat").showAlert({
                            type: "error",
                            content: error.is,
                            autoClose: true,
                            name: "submitCreateBrand"
                        });
                    }
                });
            })
        };

        return _this.init();
    };

    $.fn.initLoadBrand = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.loadChatinfos({
                url: CONF_URL.brands + "?id=-1",
                success: (data) => {
                    // Ping lấy trạng thái người dùng online
                    Chat.getInstance().sendCheckPingUsers();

                    // Cập nhật thời gian tin nhắn của chat box view hiện tại theo pingTime
                    setInterval(
                        $("#tiny-chat").updateMSGTime
                        , CONF_SOCKET.pingTime);
                },
                reject: (error) => {
                    let content = $(".chat-info__content")
                        .append($("#tiny-chat").createMini404({
                            text: error.is
                        }));
                }
            });
        };

        return _this.init();
    };

    $.fn.checkBottomScrollChatInfos = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // chatinfo
            let chatinfos = _this.find(".chatinfo");
            let chatinfoHeight = $(chatinfos).first().outerHeight();

            // Tổng
            let scrollTopHieght = _this.outerHeight() + _this.scrollTop() + chatinfoHeight;
            let totalHeight = chatinfos.length * chatinfoHeight;

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

    $.fn.onScrollExtraChatInfos = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Kiểm tra đã load xong và còn dữ liệu
            let isLoadSuccess = true;

            _this.on("scroll", function (e) {
                e.preventDefault();

                if (isLoadSuccess) {
                    _this.checkBottomScrollChatInfos({
                        success: () => {
                            isLoadSuccess = false;

                            let url = $(".chat-info__content").data("next");
                            if (url) {
                                _this.loadChatinfos({
                                    url,
                                    success: (data) => {
                                        isLoadSuccess = true;

                                        // Scorll ngay điểm bắt đầu load dữ liệu
                                        _this.updateScrollPreBottomChatInfos();

                                        // Ping lấy trạng thái người dùng online
                                        Chat.getInstance().sendCheckPingUsers();
                                    },
                                    reject: (error) => {
                                    }
                                });
                            } else {
                                _this.append($("#tiny-chat").createOutOfData({ type: "chatinfo" }));
                            }
                        },
                        reject: () => {

                        }
                    });
                }
            })

        };

        return _this.init();
    };

    $.fn.loadChatinfos = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.get({
                url: settings.url,
                success: function (data) {
                    let chatInfosContent = $(".chat-info__content");
                    let chatBoxsContent = $(".chat-box__content");

                    let items = data.items;
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i];

                        chatInfosContent.append($(chatInfosContent).createChatinfoItem({ data: item }));
                        chatBoxsContent.append($(chatBoxsContent).createChatView({ data: item.chatinfo }));

                        let chatBoxView = $(".chat-box__view[data-id=" + item.chatinfo.id + "]")
                        chatBoxView.onScrollExtraMasegers();

                        $("#chat-box__move-down").onClickMoveDowMessage();

                        _this.loadMessages({
                            url: CONF_URL.chats + "?id=" + item.chatinfo.id,
                            callback: function (data, error) {
                                // FIXME: hiển thị loadding để scorll bottom trước khi click
                                // Đã đọc thì đánh dấu
                                if (data && data.is_seen) {
                                    chatBoxView
                                        .find(".message-right .content-isseen")
                                        .last()
                                        .show();
                                }
                            }
                        });
                    }

                    chatInfosContent.data("next", data.next_page_url);
                    $(".chat-box__view").not(".active").hide();
                    $(".chatinfo").find(".badge-new-msg[data-value!=0]").show();

                    if (typeof settings.success == "function") {
                        settings.success(data);
                    }
                },
                reject: function (error) {
                    if (typeof settings.reject == "function") {
                        settings.reject(error);
                    }
                }
            });
        };

        return _this.init();
    }

    $.fn.onClickChatinfoDetail = function (options) {
        let _this = this;

        let defaults = {
            elements: "body"
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(settings.elements).on("click", settings.selector, function (e) {
                e.preventDefault();

                let chatinfo = $(this);

                // Kiểm tra active đã có hay chưa
                if (!chatinfo.hasClass("active")) {
                    let chatinfo_id = chatinfo.data("id");

                    // Active
                    $(".chatinfo").removeClass("active");
                    chatinfo.addClass("active");

                    // Focus input nhập msg
                    let inputSendMessage = $("#message-textarea");
                    inputSendMessage.data("chatinfo", chatinfo_id);
                    inputSendMessage.trigger("focus");

                    // Kiểm tra thông báo tin nhắn mới
                    let badgeNewMSG = chatinfo.find(".badge-new-msg");
                    if (badgeNewMSG.data("value") != 0) {
                        // xóa thông báo
                        badgeNewMSG
                            .data("value", 0)
                            .text(0)
                            .hide();

                        // Gửi đã xem
                        Chat.getInstance().sendSeen({
                            chatinfo_id
                        })
                    }

                    // Ẩn chat box khác
                    let chatBoxView = $(".chat-box__view");
                    chatBoxView.hide();

                    // Show chat box hiện tại
                    let crruentChatBoxView = $(".chat-box__view[data-id=" + chatinfo_id + "]");
                    crruentChatBoxView.show();

                    // Cập nhật scroll chat box
                    $(".chat-box__content").show();
                    $("#tiny-chat").updateScrollBottomChatBoxView();
                    $("#tiny-chat").updateMSGTime();
                    $("#chat-box__move-down").hide();
                }
            })
        };

        return _this.init();
    };

    $.fn.updateScrollPreBottomChatInfos = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let extraLength = settings.extraLength;
            let curentLength = _this.find(".chatinfo").length;

            if (extraLength) {
                let perHeight = _this.prop("scrollHeight") / curentLength;
                let preHeight = perHeight * (curentLength - extraLength);

                _this.scrollTop(preHeight);
            }
        };

        return _this.init();
    }
})(jQuery);
