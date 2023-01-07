import "/client/public/js/services/rsa.js";
import { CONF_SOCKET, CONF_CHAT } from "/public/js/config.js";
import { getCookie } from "/public/js/util.js";

export default class Socket extends WebSocket {
    messageCallbacks;
    closeCallbacks;
    openCallbacks;

    constructor() {
        super(CONF_SOCKET.host);

        this.messageCallbacks = [];
        this.closeCallbacks = [];
        this.openCallbacks = [];

        this.addEventListener("open", this.open);
        this.addEventListener("message", this.message);
        this.addEventListener("close", this.close);
    }

    addOpenCallbacks(cb) {
        this.openCallbacks.push(cb);
    }

    addMessageCallbacks(cb) {
        this.messageCallbacks.push(cb);
    }

    addCloseCallbacks(cb) {
        this.closeCallbacks.push(cb);
    }

    enData(data) {
        return JSON.stringify(data);
    }

    deData(data) {
        return JSON.parse(data);
    }

    open(e) {
        console.log("Đã thiết lập socket");
        // Đăng nhập socket
        this.sendLogin();

        this.openCallbacks.forEach(cb => {
            cb(e);
        });
    }

    close(e) {
        console.log("Ngắt mất kết nối socket");

        this.closeCallbacks.forEach(cb => {
            cb(e);
        });

        $("#tiny-chat").showAlert({
            type: "error",
            content: "Mất kết nối với máy chủ",
            name: "close-socket"
        });
    }

    message(e) {
        let data = this.deData(e.data);

        this.messageCallbacks.forEach(cb => {
            cb(data);
        });
    }

    send(data) {
        // DEBUG:
        console.log("send" + data.actionKey);
        console.log(data);

        if (this.OPEN == this.readyState) {

            super.send(this.enData(data));
        } else if (this.CLOSED == this.readyState) {

            $("#tiny-chat").showAlert({
                type: "error",
                content: "Không thể gửi dữ liệu",
                name: "send-socket"
            });
        }
    }

    sendLogin() {
        this.send({
            ssid: getCookie("tinychat_ssid"),
            isMember: true,
            actionKey: CONF_SOCKET.actionKey.login
        })
    }

    sendMessage(data) {
        switch (data.type) {
            case CONF_CHAT.type.text: {
                data.content = RSA
                    .getInstance()
                    .encrypt(
                        data.chatinfo_id,
                        data.content
                    );

                this.send({
                    ...data,
                    actionKey: CONF_SOCKET.actionKey.addMessage,
                })
            }
                break;
            case CONF_CHAT.type.img: {
                data.content.forEach((c) => {
                    let d = data;
                    d.content = RSA
                        .getInstance()
                        .encryptImage(
                            data.chatinfo_id,
                            c
                        );

                    this.send({
                        ...d,
                        actionKey: CONF_SOCKET.actionKey.addMessage,
                    });
                });
            }
                break;
            default:
                break;
        }
    }

    sendTyping(data) {
        this.send({
            ...data,
            actionKey: CONF_SOCKET.actionKey.updateTyping,
        })
    }

    sendCheckPingChatinfos(data = {}) {
        this.send({
            ...data,
            actionKey: CONF_SOCKET.actionKey.checkPingChatinfos
        });
    }

    sendAddChatInfo(data = {}) {
        this.send({
            ...data,
            actionKey: CONF_SOCKET.actionKey.addChatInfo,
        })
    }

    sendSeen(data = {}) {
        this.send({
            ...data,
            actionKey: CONF_SOCKET.actionKey.updateSeen,
        })
    }

    sendUpdateSeenChatinfo(data = {}) {
        this.send({
            ...data,
            actionKey: CONF_SOCKET.actionKey.updateSeenChatinfo,
        })
    }

    sendRemoveChatInfo(data = {}) {
        this.send({
            ...data,
            actionKey: CONF_SOCKET.actionKey.removeChatInfo,
        })
    }

    sendPushNotification(data = {}) {
        this.send({
            ...data,
            actionKey: CONF_SOCKET.actionKey.pushNotification,
        })
    }

    sendRemoveBrand(data = {}) {
        this.send({
            ...data,
            actionKey: CONF_SOCKET.actionKey.removeBrand,
        })
    }
}