
import { formatNoticationNumber } from "/client/public/js/util.js";
import { CONF_SOCKET } from "/client/public/js/config.js";
import Socket from "/client/public/js/services/socket.js";

window.Chat = (function () {
    let instance;

    function init(listen) {
        class Chat extends Socket {
            listen;

            constructor(ssid, listen) {
                super(ssid);

                this.listen = listen;
            }

            message(e) {
                let data = this.deData(e.data);

                // TODO: Debug
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
                    // case CONF_SOCKET.actionKey.noticationPing: {
                    //     this.updatePingUsers(data);
                    // }
                    //     break;
                    case CONF_SOCKET.actionKey.updateSeen: {
                        this.updateSeen(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.login: {
                        if (typeof this.listen == "function") {
                            this.listen(this, data);
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
                    $("#client-tiny-chat").updateScrollBottomChatBoxView();
                }
            };

            addMSGNotication(data) {
                if ($(".chat-box").is(":hidden")) {
                    let badgeNewMSG = $(".chat-bubble").find(".badge-new-msg");
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
                    this.sendSeen({
                        chatinfo_id: data.chatinfo_id
                    });
                }
            }

            // updatePingUsers(data) {
            //     if (data.length) {
            //         for (let i = 0; i < data.length; i++) {
            //             update(data[i]);
            //         }
            //     } else {
            //         update(data);
            //     }

            //     function update(data) {
            //         let user = $(".chatinfo[data-id=" + data.chatinfo_id + "]")
            //             .find(".user-online");

            //         if (data.ping) {
            //             user.addClass("badge-success");
            //         } else {
            //             user.removeClass("badge-success");
            //         }
            //     }
            // }

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


        // Create chat
        return new Chat(ssid, listen);
    }

    return {
        getInstance: function (ssid, listen = null) {
            if (!instance) {
                instance = init(ssidlisten);
            }
            return instance;
        }
    }
})();