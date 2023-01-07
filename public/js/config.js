export let CONF_PROTOCOL = "http";
export let CONF_DOMAIN = "localhost";
// export let CONF_PROTOCOL = "https";
// export let CONF_DOMAIN = "designweb.vn";
export let CONF_HOST = CONF_PROTOCOL + "://" + CONF_DOMAIN;

export let CONF_URL = {
    home: "/",
    signup: "/auth/signup",
    signin: "/auth/signin",
    signout: "/auth/signout",
    chats: "/chats",
    brands: "/brands",
    members: "/members",
    notifications: "/notifications",
    profileUser: "/user/profile",
    usermembers: "/usermembers",
}

export let CONF_SOCKET = {
    host: (CONF_PROTOCOL == "https" ? "wss" : "ws") + "://" + CONF_DOMAIN + ":8043",
    pingTime: 60 * 1000,
    reconnectTime: 5000,
    actionKey: {
        addMessage: "addMessage",
        noticationPing: "noticationPing",
        checkPingChatinfos: "checkPingChatinfos",
        logout: "logout",
        login: "login",
        addChatInfo: "addChatInfo",
        updateSeen: "updateSeen",
        updateTyping: "updateTyping",
        updateSeenChatinfo: "updateSeenChatinfo",
        removeChatInfo: "removeChatInfo",
        pushNotification: "pushNotification",
        removeBrand: "removeBrand",
    }
}

export let CONF_APP = {
    defaults: {
        images: {
            notificationEmpty: CONF_HOST + "/public/images/defaults/notifications-empty.jpg",
            dataEmpty: CONF_HOST + "/public/images/defaults/data-empty.jpg",
        }
    },
    encrypt: {
        default_key_size: 2048
    }
}

export let CONF_CHAT = {
    type: {
        text: "text",
        img: "img"
    }
}

export let CONF_UPLOAD = {
    image: {
        formats: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/svg",
            "image/webp"
        ],
        size: 2
    }
}