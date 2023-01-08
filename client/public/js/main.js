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
import "/client/public/js/jquery/image.js";

// config
import { CONF_URL, CONF_HOST } from "/client/public/js/config.js";

class ClientTinyChat {
    constructor() {
    }

    init() {
        window.notificationSound = true;
        window.remember = false;
        window.reloadchat = () => {
            let client_tiny_chat = $("#client-tiny-chat");
            client_tiny_chat.find(".chat-box").remove();

            let token = $("#client-tiny-chat-script").data("id");
            let ssid = sessionStorage.getItem(token) || localStorage.getItem(token);

            client_tiny_chat.getAjax({
                url: CONF_URL.clients,
                params: {
                    token,
                    ssid
                },
                success: function (data) {
                    let client_tiny_chat = $("#client-tiny-chat");
                    client_tiny_chat.append(`<link rel="stylesheet" href="` + CONF_HOST + `/client/public/css/main.css">`);

                    client_tiny_chat.startChat({ data });
                },
                reject: function (error) {
                    let client_tiny_chat = $("#client-tiny-chat");
                    client_tiny_chat.append(`<link rel="stylesheet" href="` + CONF_HOST + `/client/public/css/main.css">`);

                    client_tiny_chat.find(".chat-bubble").addClass("chat-bubble__register");

                    let formRegisterChat = $(client_tiny_chat.createRegisterChat({ data: error }));
                    formRegisterChat.onClickCheckRemember();
                    client_tiny_chat.append(formRegisterChat);

                    client_tiny_chat.find("#register-chat__form").submitRegisterChat();
                    client_tiny_chat.find("#mini-size-chat").onClickMiniSize();
                    client_tiny_chat.find("#notification-sound").onClickNotificationSound();

                    // Load customer đồ họa
                    client_tiny_chat.reloadLayoutChat({
                        data: error.brand.settings,
                        isInit: true
                    });

                    if (error.not == "brand") {
                        // Brand không tồn tại hoặc hết hạn
                        client_tiny_chat.find(".register-content").showError({ error });
                    }

                    client_tiny_chat.onClickAction({
                        selector: ".chat-bubble__register"
                    });
                }
            });
        }
    }

    start() {
        let client_tiny_chat = $("#client-tiny-chat");
        $("body").append(client_tiny_chat.createChatBubble());
        window.reloadchat();
    }
}

const TinyChat = new ClientTinyChat();
TinyChat.init();
TinyChat.start();