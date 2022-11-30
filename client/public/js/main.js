// libraries
import "/client/public/js/libraries/jquery-3.6.1.js";

// services
import "/client/public/js/services/chat.js";

// jquery
import "/client/public/js/jquery/ajax.js";
import "/client/public/js/jquery/chat.js";
import "/client/public/js/jquery/create.js";
import "/client/public/js/jquery/util.js";

// config
import { CONF_URL, CONF_SOCKET, CONF_HOST } from "/client/public/js/config.js";

class ClientTinyChat {
    constructor() {

    }

    run() {
        $("head").append(`<link rel="stylesheet" href="` + CONF_HOST + `/client/public/css/main.css">`);
        $("body").append($("#client-tiny-chat").createChatBubble());

        $("#client-tiny-chat").ajaxForm({
            method: "GET",
            url: CONF_URL.clients + "?token=" + $("#client-tiny-chat-script").data("id"),
            success: function (data) {
                Chat.getInstance(function (chat) {
                    $("#client-tiny-chat").initChatBox({ data });
                    $("#client-tiny-chat .chat-box__view").onScrollExtraMasegers();
                    $("#client-tiny-chat #message-textarea").submitSendMessage();

                    $("#client-tiny-chat").onClickAction({
                        selector: ".chat-bubble",
                        callback: function () {
                            // Nếu chat hidden cần nhấn để hiển thị
                            $("#client-tiny-chat").updateScrollBottomChatBoxView();
                            $("#client-tiny-chat").seenMessage({
                                chatinfo_id: data.chatinfo_id
                            })
                        }
                    });

                    setInterval(
                        $("#client-tiny-chat").updateMSGTime,
                        CONF_SOCKET.pingTime);
                });
            },
            reject: function (error) {
                $("#client-tiny-chat").onClickAction({ selector: ".chat-bubble" });
                $("#client-tiny-chat")
                    .append($("#client-tiny-chat").createRegisterChat());
                $("#client-tiny-chat #register-chat__form").submitRegisterChat();
            }
        });
    }
}

const clientTinyChat = new ClientTinyChat();
clientTinyChat.run();