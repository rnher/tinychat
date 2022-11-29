
import { formatNoticationNumber } from "/public/js/util.js";
import { CONF_SOCKET } from "/public/js/config.js";
import Socket from "/public/js/services/socket.js";

window.Chat = (function () {
    let instance;
    function init(listen) {
        class Chat extends Socket {
            listen;

            constructor(listen) {
                super();

                this.listen = listen;
            }

            open(e) {
                super.open(e);
                // Ping lấy trạng thái người dùng online
                // this.sendCheckPingUsers();
            }

            message(e) {
                let data = this.deData(e.data);

                // DEBUG:
                console.log("reciver" + data.actionKey);
                console.log(data);

                switch (data["actionKey"]) {
                    case CONF_SOCKET.actionKey.addMessage: {
                        this.addMessageItem(data);
                        if (!data.isSelf) {
                            this.addMSGNotication(data, this);
                        }
                    }
                        break;
                    case CONF_SOCKET.actionKey.noticationPing: {
                        this.updatePingUsers(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.checkPingUsers: {
                        this.updatePingUsers(data.pings);
                    }
                        break;

                    case CONF_SOCKET.actionKey.addChatInfo: {
                        this.addChatInfo(data.item, this);
                    }
                        break;
                    case CONF_SOCKET.actionKey.updateSeen: {
                        this.updateSeen(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.login: {
                        if (typeof this.listen == "function") {
                            this.listen(data);
                        }
                    }
                        break;
                    default:
                        break;
                }
            }

            addMessageItem(data) {
                let chatBoxView = $(".chat-box__view[data-id=" + data.chatinfo_id + "]");
                chatBoxView.append(chatBoxView.createMessageItem({ data }));

                if (($("#message-textarea").data("chatinfo") == data.chatinfo_id)) {
                    $("#tiny-chat").updateScrollBottomChatBoxView();
                }
            };

            addMSGNotication(data) {
                if ($("#message-textarea").data("chatinfo") != data.chatinfo_id) {
                    let badgeNewMSG = $(".chatinfo[data-id=" + data.chatinfo_id + "]").find(".badge-new-msg");
                    let objNum = formatNoticationNumber(badgeNewMSG.data("value"));
                    badgeNewMSG.data("value", objNum.num);
                    badgeNewMSG.text(objNum.display);

                    badgeNewMSG.show();
                } else {
                    this.sendSeen({
                        chatinfo_id: data.chatinfo_id
                    })
                }
            }

            updatePingUsers(data) {
                if (data.length) {
                    for (let i = 0; i < data.length; i++) {
                        update(data[i]);
                    }
                } else {
                    update(data);
                }

                function update(data) {
                    let user = $(".chatinfo[data-id=" + data.chatinfo_id + "]")
                        .find(".user-online");

                    if (data.ping) {
                        user.addClass("badge-success");
                    } else {
                        user.removeClass("badge-success");
                    }
                }
            }

            addChatInfo(data) {
                $(".chat-info__content").prepend($("#tiny-chat").createChatinfoItem({ data }));
                $(".chat-box__content").append($("#tiny-chat").createChatView({ data: data.chatinfo }));
                $(".chat-box__content[data-id=" + data.info.id + "]").hide();
            };

            updateSeen(data) {
                if (data.isSelf) {
                    let badgeNewMSG = $(".chatinfo[data-id=" + data.chatinfo_id + "]")
                        .find(".badge-new-msg")
                        .data("value", 0)
                        .text(0)
                        .hide();
                } else {
                    let chatBoxView = $(".chat-box__view[data-id=" + data.chatinfo_id + "]");
                    chatBoxView.find(".message-right .content-isseen").hide();
                    chatBoxView.find(".message-right:last-child .content-isseen").show();
                }
            }
        }

        return new Chat(listen);
    }

    return {
        getInstance: function (listen = null) {
            if (!instance) {
                instance = init(listen);
            }
            return instance;
        }
    }
})();