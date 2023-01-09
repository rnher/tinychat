import { CONF_SOCKET, CONF_CHAT } from "/client/public/js/config.js";

export default class Socket extends WebSocket {
    ssid;
    messageCallbacks;
    closeCallbacks;
    openCallbacks;

    constructor(ssid) {
        super(CONF_SOCKET.host);

        this.ssid = ssid;
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
            // TODO: không nhắn được
        }
    }

    sendLogin() {
        this.send({
            ssid: this.ssid,
            isMember: false,
            actionKey: CONF_SOCKET.actionKey.login
        })
    }

    sendLogout() {
        this.send({
            actionKey: CONF_SOCKET.actionKey.logout
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

    // sendCheckPingChatinfos() {
    //     this.send({
    //         actionKey: CONF_SOCKET.actionKey.checkPingChatinfos
    //     });
    // }

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
}