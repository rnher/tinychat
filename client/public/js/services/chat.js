import "/client/public/js/services/rsa.js";
import { formatNoticationNumber } from "/client/public/js/util.js";
import { CONF_SOCKET } from "/client/public/js/config.js";
import Socket from "/client/public/js/services/socket.js";

window.Chat = (function () {
    let instance;

    function init(ssid, listen) {
        class Chat {
            socket;
            listen;
            ssid;

            constructor(ssid, listen) {
                this.ssid = ssid;
                this.listen = listen;

                this.initSocket(this.ssid);
            }

            initSocket(ssid) {
                this.socket = new Socket(ssid);
                this.socket.addMessageCallbacks(this.message.bind(this));
                this.socket.addCloseCallbacks(this.close.bind(this));
                this.socket.addOpenCallbacks(this.open.bind(this));
            }

            open(e) {
                let client_tiny_chat = $("#client-tiny-chat");

                client_tiny_chat.find(".chat-box__head").find(".loader-blur").remove();

                client_tiny_chat.find(".chat-box__head").append(
                    client_tiny_chat.createLoader({
                        type: "socket",
                        color: "success"
                    }));

                // setTimeout(() => {
                client_tiny_chat.find(".chat-box__head").find(".loader-blur").slideUp("slow", function (e) {
                    $(this).remove();
                });
                // }, 2000);
            }

            close(e) {
                let client_tiny_chat = $("#client-tiny-chat");

                if (!client_tiny_chat.find(".chat-box__head .loader-blur").length) {
                    let loading = $(client_tiny_chat.createLoader({
                        type: "socket",
                        color: "error"
                    })).hide();

                    client_tiny_chat.find(".chat-box__head").append(loading);
                    loading.slideDown("slow");
                }

                this.listen = null;

                setTimeout(() => {
                    this.initSocket(this.ssid);
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
                    case CONF_SOCKET.actionKey.updateSeen: {
                        this.updateSeen(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.login: {
                        this.login(data);
                    }
                        break;
                    default:
                        break;
                }

                $("client-tiny-chat").reloadLayoutChat({
                    isReload: true
                });
            }

            login(data) {
                if (typeof this.listen == "function") {
                    this.listen(this.socket, data);
                }
            }

            addMessageItem(data) {
                let client_tiny_chat = $("#client-tiny-chat");

                let chatBoxView = client_tiny_chat.find(".chat-box__view[data-id=" + data.chatinfo_id + "]");

                chatBoxView.append(chatBoxView.createMessageItem({ data }));

                chatBoxView.uploadLayoutMessage({
                    chatinfo_id: data.chatinfo_id
                });

                if ((client_tiny_chat.find("#message-textarea").data("chatinfo") == data.chatinfo_id)) {
                    chatBoxView.checkBottomScrollMessage({
                        success: () => {
                            client_tiny_chat.updateScrollBottomChatBoxView();
                        },
                        reject: () => {
                            if (!client_tiny_chat.find(".chat-box__content .new-msg-badge").length) {
                                client_tiny_chat.find(".chat-box__content")
                                    .append(client_tiny_chat.createNewMSGBadge());
                            }
                        }
                    });
                }

                chatBoxView.updateMSGTime();

                if (!data.isSelf) {
                    chatBoxView.playSoundNotification({ type: "msg" });
                    this.addMSGNotication(data, this);
                }
            };

            updateTyping(data) {
                if (!data.isSelf) {
                    let client_tiny_chat = $("#client-tiny-chat");

                    let chatBoxView = client_tiny_chat.find(".chat-box__view[data-id=" + data.chatinfo_id + "]");
                    // If chat box view is visible
                    if (chatBoxView) {
                        if (data.typing) {
                            let exit_typing = chatBoxView.find(".typing-message");
                            if (!exit_typing.length) {
                                // Add typing
                                chatBoxView.append(chatBoxView.createTypingMessage({ data }));

                                if ((client_tiny_chat.find("#message-textarea").data("chatinfo") == data.chatinfo_id)) {
                                    chatBoxView.checkBottomScrollMessage({
                                        success: () => {
                                            client_tiny_chat.updateScrollBottomChatBoxView();
                                        },
                                        reject: () => {
                                        }
                                    });
                                }

                                chatBoxView.playSoundNotification({ type: "typing" });
                            }
                        } else {
                            this._hideTyping(data.chatinfo_id, data.id);
                        }
                    }
                }
            };

            addMSGNotication(data) {
                let client_tiny_chat = $("#client-tiny-chat");

                if (client_tiny_chat.find(".chat-box").is(":hidden")) {
                    let badgeNewMSG = client_tiny_chat.find(".chat-bubble").find(".badge-new-msg");
                    let value = badgeNewMSG.data("value");
                    if (!value) {
                        badgeNewMSG.data("value", 1);
                        badgeNewMSG.text(1);
                    } else {
                        let objNum = formatNoticationNumber(badgeNewMSG.data("value"));
                        badgeNewMSG.data("value", objNum.num);
                        badgeNewMSG.text(objNum.display);
                    }

                    badgeNewMSG.show();
                } else {
                    this.socket.sendSeen({
                        chatinfo_id: data.chatinfo_id
                    });
                }
            }

            updatePingUsers(data) {
                let _this = this;

                function updateBrandPing(ping, brand_id = null) {
                    // Off
                    if (!ping.ping) {
                        _this._hideTyping(ping.chatinfo_id, brand_id);
                    } else {
                        // ON
                    }
                }

                let pings = data.pings;
                for (let i = 0; i < pings.length; i++) {
                    let ping = pings[i];

                    if (!data.isSelf) {
                        updateBrandPing(ping, data.id);
                    }
                }
            }

            updateSeen(data) {
                let client_tiny_chat = $("#client-tiny-chat");

                if (data.isSelf) {
                    let badgeNewMSG = client_tiny_chat.find(".chatinfo[data-id=" + data.chatinfo_id + "]")
                        .find(".badge-new-msg")
                        .data("value", 0)
                        .text(0)
                        .hide();
                } else {
                    let chatBoxView = client_tiny_chat.find(".chat-box__view[data-id=" + data.chatinfo_id + "]");
                    chatBoxView.find(".message-right .content-isseen").hide();
                    chatBoxView.find(".message-right:last-child .content-isseen").show();
                }
            }

            _hideTyping(chatinfo_id, brand_id = null) {
                let client_tiny_chat = $("#client-tiny-chat");
                let chat_box_view = client_tiny_chat.find(`.chat-box__view[data-id="${chatinfo_id}"]`);

                if (chat_box_view.length) {
                    let typing_messages = chat_box_view.find(`.typing-message`);
                    for (let i = 0; i < typing_messages.length; i++) {
                        let typing_message = $(typing_messages[i]);

                        let user = typing_message.find(`.message-user[data-id="${brand_id}"]`).length;

                        if (user) {
                            typing_message.remove();
                            break;
                        }
                    }
                }
            }
        }

        // Create chat
        return new Chat(ssid, listen);
    }

    return {
        getInstance: function (ssid, listen = null, is_create_new = false) {
            if (!instance || is_create_new) {
                instance = init(ssid, listen);
            }
            return instance.socket;
        }
    }
})();