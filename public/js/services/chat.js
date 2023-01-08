
import "/client/public/js/services/rsa.js";
import { formatNoticationNumber } from "/public/js/util.js";
import { CONF_SOCKET, CONF_URL } from "/public/js/config.js";
import Socket from "/public/js/services/socket.js";

window.Chat = (function () {
    let instance;

    function init(listen) {
        class Chat {
            socket;
            listen;
            // listChatinfoID;
            listPingChatinfos;

            constructor(listen = null) {
                this.listen = listen;
                // this.listChatinfoID = [];
                this.listPingChatinfos = [];

                this.initSocket();
            }

            initSocket() {
                this.socket = new Socket();
                this.socket.addMessageCallbacks(this.message.bind(this));
                this.socket.addCloseCallbacks(this.close.bind(this));
                this.socket.addOpenCallbacks(this.open.bind(this));
            }

            open(e) {
                $("tiny-chat").closeAlert();

                $("#tiny-chat").showAlert({
                    type: "success",
                    content: "Đã được kết nối với máy chủ",
                    name: "open-socket",
                    autoClose: true
                });
            }

            close(e) {
                this.listen = null;

                setTimeout(() => {
                    this.initSocket();
                }, CONF_SOCKET.reconnectTime);
            }

            message(data) {
                // DEBUG:
                console.log("receiver" + data.actionKey);
                console.log(data);

                switch (data["actionKey"]) {
                    case CONF_SOCKET.actionKey.addMessage: {
                        this.addMessageItem(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.updateTyping: {
                        this.updateTyping(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.noticationPing: {
                        this.updatePingUsers(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.checkPingChatinfos: {
                        this.updatePingUsers(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.addChatInfo: {
                        this.addChatInfo(data.item, this);
                    }
                        break;
                    case CONF_SOCKET.actionKey.removeChatInfo: {
                        this.removeChatInfo(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.updateSeen: {
                        this.updateSeen(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.updateSeenChatinfo: {
                        this.updateSeenChatinfo(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.pushNotification: {
                        this.pushNotification(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.removeBrand: {
                        this.removeBrand(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.login: {
                        this.login(data);
                    }
                        break;
                    default:
                        break;
                }
            }

            login(data) {
                if (data.error) {
                    window.location.href = CONF_URL.signout;
                } else {
                    // Get all data
                    this._sendCheckPingChatinfos();

                    if (typeof this.listen == "function") {
                        this.listen(this.socket, data);
                    }
                }
            }

            addMessageItem(data) {
                let tiny_chat = $("#tiny-chat");

                let chatBoxView = tiny_chat.find(".chat-box__view[data-id=" + data.chatinfo_id + "]");
                // Xóa bg không có tin nhắn
                chatBoxView.add404({
                    target: chatBoxView,
                    isEmpty: true
                });

                // Tạo chat view khi người dùng đã xóa cuộc trò chuyện trước đó
                if (!chatBoxView) {
                    // TODO add chatinfo khi người dùng đã xóa cuộc trò chuyện trước đó
                }

                chatBoxView.append(chatBoxView.createMessageItem({ data }));
                chatBoxView.updateMSGChatinfo({
                    id: data.chatinfo_id,
                    data,
                });

                chatBoxView.uploadLayoutMessage({
                    chatinfo_id: data.chatinfo_id
                });

                if ((tiny_chat.find("#message-textarea").data("chatinfo") == data.chatinfo_id)) {
                    chatBoxView.checkBottomScrollMessage({
                        success: () => {
                            tiny_chat.updateScrollBottomChatBoxView();
                        },
                        reject: () => {
                            if (!tiny_chat.find(".chat-box__content .new-msg-badge").length) {
                                tiny_chat.find(".chat-box__content")
                                    .append(tiny_chat.createNewMSGBadge());
                            }
                        }
                    });
                }

                chatBoxView.updateMSGTime();

                if (!data.isSelf && !data.isBrandSelf) {
                    chatBoxView.playSoundNotification({ type: "msg" });
                    this.addMSGNotication(data, this);
                }
            };

            updateTyping(data) {
                if (!data.isSelf || (!data.isSelf && data.isBrandSelf)) {
                    let tiny_chat = $("#tiny-chat");

                    let chatBoxView = tiny_chat.find(".chat-box__view[data-id=" + data.chatinfo_id + "]");
                    // If chat box view is visible
                    if (chatBoxView) {
                        if (data.typing) {
                            chatBoxView.showChatinfoTypingBubble({
                                chatinfo_id: data.chatinfo_id
                            });

                            // Add typing
                            chatBoxView.append(chatBoxView.createTypingMessage({ data }));

                            if ((tiny_chat.find("#message-textarea").data("chatinfo") == data.chatinfo_id)) {
                                chatBoxView.checkBottomScrollMessage({
                                    success: () => {
                                        tiny_chat.updateScrollBottomChatBoxView();
                                    },
                                    reject: () => {
                                    }
                                });
                            }

                            chatBoxView.playSoundNotification({ type: "typing" });
                        } else {
                            this._hideTyping(data.chatinfo_id, data.id);
                        }
                    }
                }
            };

            addMSGNotication(data) {
                if ($("#message-textarea").data("chatinfo") != data.chatinfo_id) {
                    let badgeNewMSG = $(".chatinfo[data-id=" + data.chatinfo_id + "]").find(".badge-new-msg");
                    let objNum = formatNoticationNumber(badgeNewMSG.attr("data-value"));
                    badgeNewMSG.attr("data-value", objNum.num);
                    badgeNewMSG.text(objNum.display);

                    badgeNewMSG.show();
                } else {
                    this.socket.sendSeen({
                        chatinfo_id: data.chatinfo_id
                    });
                }

                $("#tiny-chat").updateBrandNotification({ brandID: data.brand_id });
            }

            updatePingUsers(data) {
                let _this = this;
                function updateCustomer(ping) {
                    // Cập nhật listPingChatinfos
                    let indexPingUser = _this.listPingChatinfos.findIndex(function (pingUser) {
                        if (pingUser.chatinfo_id == ping.chatinfo_id) {
                            // Update ping data
                            pingUser.ping = ping.ping;
                        }
                    });

                    // Thêm listPingChatinfos
                    if (indexPingUser == -1) {
                        _this.listPingChatinfos.push(ping)
                    }
                }

                function updateMember(ping, user_id = null) {
                    // Off
                    if (!ping.ping) {
                        _this._hideTyping(ping.chatinfo_id, user_id);
                    } else {
                        // ON
                    }
                }

                let pings = data.pings;
                for (let i = 0; i < pings.length; i++) {
                    let ping = pings[i];

                    if (data.isBrandSelf) {
                        updateMember(ping, data.id);
                    } else {
                        updateCustomer(ping);
                    }
                }

                this._updatePingChatinfos();
            }

            addChatInfo(data) {
                RSA.getInstance().add(
                    data.chatinfo.id,
                    data.chatinfo.public_key,
                    data.chatinfo.private_key
                );

                let chatInfoListContent = $(`.chat-info__list-chatinfo[data-id=${data.chatinfo.brand_id}]`);
                // Ẩn thông báo lỗi
                chatInfoListContent.add404({
                    isEmpty: true,
                    target: chatInfoListContent
                });
                // Add chat info
                chatInfoListContent.prepend($("#tiny-chat").createChatinfoItem({ data }));

                // Add add chat box
                let chatBoxListContent = $(`.chat-box__content-list[data-id=${data.chatinfo.brand_id}]`);
                chatBoxListContent.append($("#tiny-chat").createChatView({ data: data.chatinfo }));
                // Ẩn nó, khi click mới hiện
                chatBoxListContent.find(`.chat-box__view[data-id=${data.chatinfo.id}]`)
                    .hide().onScrollExtraMessagers();

                // Add vào danh sách queue để sau này lấy online status
                // this.listChatinfoID.push(data.chatinfo.id);

                $(`.chatinfo[data-id=${data.chatinfo.id}] .action-icon`)
                    .onClickChatInfoMenu({ target: `.chatinfo[data-id=${data.chatinfo.id}]` });

                // Kiểm tra ping users sau khi add
                this._updatePingChatinfos();

                $("#tiny-chat").updateBrandNotification({ brandID: data.chatinfo.brand_id });

                // Chuông thông báo
                $("#tiny-chat").playSoundNotification({ type: "greeting" });
            };

            removeChatInfo(data) {
                let tiny_chat = $("#tiny-chat");

                tiny_chat.removeChatinfo({ id: data.chatinfo_id });
                tiny_chat.updateBrandNotification({ brandID: data.brand_id });
            };

            updateSeen(data) {
                if (data.isSelf || (!data.isSelf && data.isBrandSelf)) {
                    let badgeNewMSG = $(".chatinfo[data-id=" + data.chatinfo_id + "]")
                        .find(".badge-new-msg")
                        .attr("data-value", 0)
                        .text(0)
                        .hide();

                    $("#tiny-chat").updateBrandNotification({ brandID: data.brand_id });
                } else {
                    let chatBoxView = $(".chat-box__view[data-id=" + data.chatinfo_id + "]");
                    chatBoxView.find(".message-right .content-isseen").hide();
                    chatBoxView.find(".message-right:last-child .content-isseen").show();
                }
            }

            updateSeenChatinfo(data) {
                $(`.chatinfo[data-id=${data.chatinfo_id}]`).attr("data-seen", data.is_seen_brand);
                $(`.chatinfo[data-id=${data.chatinfo_id}]`).find(".badge-new").remove();
                $(`.chatinfo[data-id=${data.chatinfo_id}]`).find(".badge-new-msg")
                    .attr("data-value", 0)
                    .text(0)
                    .hide();

                $("#tiny-chat").updateBrandNotification({ brandID: data.brand_id });
            }

            pushNotification(data) {
                $("#tiny-chat").add404({
                    target: ".notifications",
                    isEmpty: true
                });

                let noti = $($("#tiny-chat").createNotificationItem(data));
                noti.onClickNotification({ notification_id: data.notification.id });
                $(".brand-navigation-bar__item .notifications").prepend(noti);
                noti.updateNotification();

                // Chuông thông báo
                $("#tiny-chat").playSoundNotification({ type: "notification" });
            }

            removeBrand(data) {
                $("tiny-chat").loadDataBrand({
                    data,
                    isRemove: true
                });
            }

            _updatePingChatinfos() {
                let tinychat = $("#tiny-chat");

                for (let i = 0; i < this.listPingChatinfos.length; i++) {
                    let pingUser = this.listPingChatinfos[i];

                    let indexPingUser = this.listPingChatinfos.findIndex(function (data) {
                        // Nếu có danh sách chờ ping users 
                        if (pingUser.chatinfo_id == data.chatinfo_id) {
                            let user = tinychat.find(".chatinfo[data-id=" + pingUser.chatinfo_id + "]")
                                .find(".user-online");

                            if (pingUser.ping) {
                                user.addClass("badge-success");
                            } else {
                                user.removeClass("badge-success");

                                let chat_box_view = tinychat.find(`.chat-box__view[data-id="${pingUser.chatinfo_id}"]`);
                                let typing_messages = chat_box_view.find(".typing-message.message-left");
                                typing_messages.remove();

                                if (!chat_box_view.find(".typing-message").length) {
                                    chat_box_view.hideChatinfoTypingBubble({
                                        chatinfo_id: pingUser.chatinfo_id
                                    });
                                }
                            }

                            // Thoát
                            return;
                        }
                    });

                    // Xóa khỏi hàng đợi vì indexPingUser != 1. Có phần tử trong mảng
                    this.listPingChatinfos.slice(indexPingUser, 1);
                }
            }

            _hideTyping(chatinfo_id, user_id = null) {
                let tinychat = $("#tiny-chat");
                let chat_box_view = tinychat.find(`.chat-box__view[data-id="${chatinfo_id}"]`);

                if (chat_box_view.length) {
                    let typing_messages = chat_box_view.find(`.typing-message`);
                    for (let i = 0; i < typing_messages.length; i++) {
                        let typing_message = $(typing_messages[i]);

                        let user = typing_message.find(`.message-user[data-id="${user_id}"]`).length;

                        if (user) {
                            typing_message.remove();
                            break;
                        }
                    }

                    if (!chat_box_view.find(".typing-message").length) {
                        chat_box_view.hideChatinfoTypingBubble({
                            chatinfo_id
                        });
                    }
                }
            }

            _sendCheckPingChatinfos() {
                let tinychat = $("#tiny-chat");

                let chat_info_list_chatinfos = tinychat.find(".chat-info__content .chat-info__list-chatinfo");
                chat_info_list_chatinfos.each((index1, value1) => {
                    let socketData = {
                        chatinfo_ids: [],
                        brand_id: ""
                    };

                    let chat_info_list_chatinfo = $(value1);
                    socketData.brand_id = chat_info_list_chatinfo.data("id");

                    let chatinfos = chat_info_list_chatinfo.find(".chatinfo");
                    chatinfos.each((index2, value2) => {
                        let chatinfo = $(value2);

                        socketData.chatinfo_ids.push(chatinfo.data("id"));
                    });

                    this.socket.sendCheckPingChatinfos(socketData);
                });
            }
        }

        return new Chat(listen);
    }

    return {
        getInstance: function (listen = null) {
            if (!instance) {
                instance = init(listen);
            }
            return instance.socket;
        },
    }
})();