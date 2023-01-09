import "/public/js/libraries/jquery-3.6.1.js";
import "/public/js/jquery/brand.js";
import "/public/js/services/rsa.js";
import { CONF_URL, CONF_SOCKET, CONF_CHAT, CONF_APP } from "/public/js/config.js";
import { getDate } from "/public/js/util.js";

(function ($) {
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

                let element = $(this);

                if (isLoadSuccess) {
                    _this.checkBottomScroll({
                        target: ".chatinfo",
                        success: () => {
                            isLoadSuccess = false;

                            // Add loading
                            let loading = $($("#tiny-chat").createLoader({
                                type: "chatinfo",
                                color: "success"
                            }));
                            _this.append(loading);

                            let url = element.data("next");
                            if (url) {
                                _this.loadChatinfos({
                                    url,
                                    success: (data) => {
                                        isLoadSuccess = true;

                                        // Remove loading 
                                        loading.remove();

                                        // Scorll ngay điểm bắt đầu load dữ liệu
                                        _this.updateScrollPreBottom({
                                            target: ".chatinfo"
                                        });
                                        // Cập nhật thông báo tổng của nhãn hàng
                                        _this.updateBrandNotification({
                                            brandID: data.brand_id,
                                        });
                                    },
                                    reject: (error) => {
                                        // Remove loading 
                                        loading.remove();
                                    }
                                });
                            } else {
                                // Remove loading 
                                loading.remove();

                                _this.append($("#tiny-chat").createOutOfData({ type: "chatinfo" }));
                            }
                        },
                        reject: (error) => {
                            // TODO: không thể tải thêm
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
            _this.getAjax({
                url: settings.url,
                params: settings.params,
                success: function (data) {
                    let socketData = {
                        chatinfo_ids: [],
                        brand_id: data.brand_id
                    };

                    let chatInfosContent = $(`.chat-info__list-chatinfo[data-id=${data.brand_id}]`);
                    let chatBoxsContent = $(`.chat-box__content-list[data-id=${data.brand_id}]`);

                    let items = data.items;
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i];

                        RSA.getInstance().add(
                            item.chatinfo.id,
                            item.chatinfo.public_key,
                            item.chatinfo.private_key
                        );

                        socketData.chatinfo_ids.push(item.chatinfo.id);

                        chatInfosContent.append($("#tiny-chat").createChatinfoItem({ data: item }));

                        let chatBoxView = $($("chatBoxsContent").createChatView({ data: item.chatinfo }));
                        chatBoxView.onScrollExtraMessagers();
                        chatBoxsContent.append(chatBoxView);

                        $(`.chatinfo[data-id=${item.chatinfo.id}] .action-icon`)
                            .onClickChatInfoMenu({ target: `.chatinfo[data-id=${item.chatinfo.id}]` });


                        $("#chat-box__move-down").onClickMoveDowMessage();

                        _this.loadMessages({
                            url: CONF_URL.chats + "?id=" + item.chatinfo.id,
                            callback: function (data, error) {
                                // Đã đọc thì đánh dấu
                                if (data && data.count_not_seen) {
                                    chatBoxView
                                        .find(".message-right .content-isseen")
                                        .last()
                                        .show();
                                }

                                // Lấy tin nhắn mới nhất
                                if (data.items[0]) {
                                    _this.updateMSGChatinfo({
                                        id: data.chatinfo_id,
                                        data: data.items[0]
                                    });
                                }

                                _this.updateScrollBottomChatBoxView();
                            }
                        });
                    }

                    Chat.getInstance().sendCheckPingChatinfos(socketData);

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

    $.fn.onClickExpandChatinfo = function (options) {
        let _this = this;

        let defaults = {
            elements: "body",
            intervalUpdateMSGTime: null
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(settings.elements).on("click", settings.selector, function (e) {
                e.preventDefault();
                let tiny_chat = $("#tiny-chat");

                let chatinfo = $(this);

                tiny_chat.find(".chat-box__banner").hide();

                // Kiểm tra active đã có hay chưa
                if (!chatinfo.hasClass("active")) {
                    let brand_id = chatinfo.parent().data("id");
                    let chatinfo_id = chatinfo.data("id");

                    let pre_chatinfo = tiny_chat.find(".chatinfo.active");
                    // Active
                    tiny_chat.find(".chatinfo").removeClass("active");
                    chatinfo.addClass("active");

                    chatinfo.resetClickChatInfo({
                        brand_id,
                        chatinfo_id,
                        re_chatinfo_id: pre_chatinfo.data("id")
                    });

                    if (settings.intervalUpdateMSGTime) {
                        clearInterval(settings.intervalUpdateMSGTime);
                    }

                    settings.intervalUpdateMSGTime = setInterval(
                        tiny_chat.updateMSGTime
                        , CONF_SOCKET.pingTime
                    );
                }
            })
        };

        return _this.init();
    };

    // Search offline with name and phone
    // TODO: search theo brand
    //  TODO:  Xóa khi chuyển sang brand khác
    $.fn.onSearchChatInfo = function (options) {
        let _this = this;

        let defaults = {
            chatinfoContent: ".chat-info__list-chatinfo:visible"
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("keyup", function (e) {
                let search = $(this).val();
                if (search.length) {
                    let listChatinfo = $(settings.chatinfoContent).find(".chatinfo");
                    listChatinfo.hide();

                    let reg = RegExp(`(${search})\w*`, "i");
                    listChatinfo.each(function (i, chatinfo) {
                        let name = $(chatinfo).find(".user-name").text();
                        // let text = $(chatinfo).find(".user-text").text();

                        // Xét tên và số điện thoại
                        // if (reg.test(name) || reg.test(text)) {
                        if (reg.test(name)) {
                            $(chatinfo).show();
                        }
                    });
                } else {
                    $(settings.chatinfoContent).find(".chatinfo").show();
                }
            });
        };

        return _this.init();
    };

    $.fn.onClickChatInfoMenu = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.initEventMenu = function (menu, chatinfoID, brandID) {
                $(menu).find(".chatinfo-menu__item-block").onClickBlockChatInfo({
                    chatinfoID,
                    brandID
                });

                $(menu).find(".chatinfo-menu__item").on("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            };

            _this.on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                let chatinfoAction = $(this);

                let target = $(settings.target);
                let positionTarget = target.position();

                $(".chatinfo").find(".chatinfo-menu").remove();

                let customer = {
                    name: target.attr("data-name"),
                    phone: target.attr("data-phone"),
                    mail: target.attr("data-mail"),
                    create_date: target.attr("data-createdate")
                }
                let menu = $(target.createChatinfoMenu(customer));
                target.append(menu);

                let wPadd = chatinfoAction.outerWidth() - chatinfoAction.width();
                let wPaddTarget = target.outerWidth() - target.width();
                let left = target.outerWidth() + chatinfoAction.outerWidth() + wPadd * 2;
                let top = positionTarget.top + target.outerHeight() * 2 + wPadd;

                target.find(menu).css("left", `${left}px`);
                target.find(menu).css("top", `${top}px`);

                chatinfoAction.blurBlackground({
                    targetname: "chatinfoAction",
                    isLoading: false
                })
                    .show();
                chatinfoAction.onClickBlurBackgound({
                    target: menu,
                    targetname: "chatinfoAction"
                });

                _this.initEventMenu(menu, target.data("id"), target.parent().data("id"))
            });
        };

        return _this.init();
    };

    $.fn.removeChatinfo = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");

            tiny_chat.find(`.chatinfo[data-id=${settings.id}]`).remove();
            tiny_chat.find(`.chat-box__view[data-id=${settings.id}]`).remove();
            tiny_chat.find(".chat-box__move-down").hide();
            tiny_chat.find(".chat-box__input").hide();

            let inputSendMessage = tiny_chat.messageTextarea();
            inputSendMessage.data("chatinfo", "")
            inputSendMessage.val("");

            tiny_chat.checkEmptyChatinfos();
        };

        return _this.init();
    };

    $.fn.onClickBlockChatInfo = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {

            _this.on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                _this.deleteAjax({
                    url: CONF_URL.chats,
                    params: {
                        id: settings.chatinfoID,
                        brand_id: settings.brandID,
                    },
                    success: (data) => {
                        // _this.removeChatinfo({ id: data.chatinfo_id });
                        _this.blurBlackground().hide();

                        Chat.getInstance().sendRemoveChatInfo(data);
                    },
                    reject: (error) => {
                        $("#tiny-chat").showAlert({
                            type: "error",
                            content: error.is,
                            autoClose: true,
                            name: "onClickBlockChatInfo"
                        });
                    }
                });
            });
        };

        return _this.init();
    }

    $.fn.checkEmptyChatinfos = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");
            let chatinfo_list = null;

            if (settings.brand_id) {
                chatinfo_list = tiny_chat.find(`.chat-info__list-chatinfo[data-id=${settings.brand_id}]`);
            } else {
                chatinfo_list = tiny_chat.find(".chat-info__list-chatinfo.active");
            }

            // Chatinfo empty
            if (!chatinfo_list.find(".chatinfo").length) {
                debugger;
                chatinfo_list.append(tiny_chat.createMini404({
                    type: "chatinfo",
                    image: CONF_APP.defaults.images.chatinfoEmpty
                }));

                tiny_chat.find(".chat-box__banner").show();
            }
        };

        return _this.init();
    };

    $.fn.updateMSGChatinfo = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let data = settings.data;

            let time = data.time;
            let content = null;

            switch (data.type) {
                case CONF_CHAT.type.text: {
                    content = data.content;
                }
                    break;
                case CONF_CHAT.type.img: {
                    content = "[Hình ảnh]"
                }
                    break;
                default: {
                }
                    break;
            }

            let chatinfo = $(`.chatinfo[data-id=${settings.id}]`);
            if (chatinfo.length && data) {
                if (content) {
                    let data_content = chatinfo.find(".user-text span");
                    data_content.text(content);
                    data_content.prop("title", content);
                }


                if (time) {
                    let date_content = chatinfo.find(".date-content span");
                    let time_content = getDate(time, false, true);
                    date_content.text(time_content);
                }
            }
        };

        return _this.init();
    };

    $.fn.checkNotSeen = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let chatinfo_id = settings.chatinfo_id;
            let brand_id = settings.brand_id;

            let chatinfoListChatinfo = $(`.chat-info__list-chatinfo[data-id=${brand_id}]`);
            let notSeen = chatinfoListChatinfo.find(`.chatinfo[data-id="${chatinfo_id}"][data-seen!="1"]`);

            return !!notSeen.length;
        };

        return _this.init();
    };

    $.fn.checkNewMSG = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let chatinfo_id = settings.chatinfo_id;
            let brand_id = settings.brand_id;

            let chatinfoListChatinfo = $(`.chat-info__list-chatinfo[data-id=${brand_id}]`);
            let newMsg = chatinfoListChatinfo.find(`.chatinfo[data-id="${chatinfo_id}"]`).find(`.badge-new-msg[data-value!="0"]`);

            return !!newMsg.length;
        };

        return _this.init();
    };

    $.fn.showChatinfoTypingBubble = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");
            let chatinfo = tiny_chat.find(".chat-info__list-chatinfo .chatinfo[data-id=" + settings.chatinfo_id + "]");

            let userText = chatinfo.find(".info-content .user-text");

            if (!userText.find(".typing-bubble").length) {
                userText.prepend(chatinfo.createTypingBubble({
                    title: "Đang trả lời"
                }));
                userText.find("span.content").hide();
            }
        };

        return _this.init();
    };

    $.fn.hideChatinfoTypingBubble = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");
            let chatinfo = tiny_chat.find(".chat-info__list-chatinfo .chatinfo[data-id=" + settings.chatinfo_id + "]");

            let userText = chatinfo.find(".info-content .user-text");
            userText.find(".typing-bubble").remove();
            userText.find("span.content").show();
        };

        return _this.init();
    };
})(jQuery);
