
export let CONF_PROTOCOL = "http";
export let CONF_DOMAIN = "159.223.80.158";
export let CONF_HOST = CONF_PROTOCOL + "://" + CONF_DOMAIN;

export let CONF_URL = {
    clients: CONF_HOST + "/clients",
}

export let CONF_SOCKET = {
    url: (CONF_PROTOCOL == "https" ? "wss" : "ws") + "://" + CONF_DOMAIN + ":8080",
    pingTime: 60 * 1000,
    actionKey: {
        addMessage: "addMessage",
        noticationPing: "noticationPing",
        checkPingUsers: "checkPingUsers",
        logout: "logout",
        login: "login",
        addChatInfo: "addChatInfo",
        updateSeen: "updateSeen"
    }
}