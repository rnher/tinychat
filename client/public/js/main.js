// libraries
import "/client/public/js/libraries/jquery-3.6.1.js";

// services
import "/client/public/js/services/chat.js";

// jquery
import "/client/public/js/jquery/ajax.js";
import "/client/public/js/jquery/chat.js";
import "/client/public/js/jquery/message.js";
import "/client/public/js/jquery/create.js";
import "/client/public/js/jquery/util.js";
import "/client/public/js/jquery/layout.js";
import "/client/public/js/jquery/image.js";

// config
import { CONF_URL, CONF_HOST } from "/client/public/js/config.js";

class ClientTinyChat {
    constructor() {
    }

    run() {
        window.notificationSound = true;
        window.remember = false;

        let clientTinyChat = $("#client-tiny-chat");

        $("body").append(clientTinyChat.createChatBubble());

        let token = $("#client-tiny-chat-script").data("id");
        let ssid = sessionStorage.getItem(token) || localStorage.getItem(token);

        clientTinyChat.get({
            url: CONF_URL.clients,
            params: {
                token,
                ssid
            },
            success: function (data) {
                let clientTinyChat = $("#client-tiny-chat");
                clientTinyChat.append(`<link rel="stylesheet" href="` + CONF_HOST + `/client/public/css/main.css">`);

                clientTinyChat.startChat({ data });
            },
            reject: function (error) {
                let clientTinyChat = $("#client-tiny-chat");
                clientTinyChat.append(`<link rel="stylesheet" href="` + CONF_HOST + `/client/public/css/main.css">`);

                clientTinyChat.find(".chat-bubble").addClass("chat-bubble__register");

                let formRegisterChat = $(clientTinyChat.createRegisterChat({ data: error }));
                formRegisterChat.onClickCheckRemember();
                clientTinyChat.append(formRegisterChat);

                clientTinyChat.find("#register-chat__form").submitRegisterChat();
                clientTinyChat.find("#mini-size-chat").onClickMiniSize();
                clientTinyChat.find("#notification-sound").onClickNotificationSound();

                // Load customer đồ họa
                clientTinyChat.reloadLayoutChat({
                    data: error.brand.settings,
                    isInit: true
                });

                if (error.not == "brand") {
                    // Brand không tồn tại hoặc hết hạn
                    clientTinyChat.find(".register-content").showError({ error });
                }

                clientTinyChat.onClickAction({
                    selector: ".chat-bubble__register"
                });
            }
        });
    }
}

const clientTinyChat = new ClientTinyChat();
clientTinyChat.run();