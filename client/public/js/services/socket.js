import { CONF_SOCKET } from "/client/public/js/config.js";
import { getCookie } from "/client/public/js/util.js";

export default class Socket extends WebSocket {
    ssid;

    constructor(ssid) {
        super(CONF_SOCKET.url);

        this.ssid = ssid;

        this.addEventListener("open", this.open);
        this.addEventListener("message", this.message);
        this.addEventListener("close", this.close);
    }

    isOpen() {
        return this.OPEN == this.readyState;
    }

    isClosed() {
        return this.CLOSED == this.readyState;
    }

    enData(data) {
        return JSON.stringify(data);
    }

    deData(data) {
        return JSON.parse(data);
    }

    open(e) {
        console.log("Đã thiết lập socket");
        this.sendLogin();
    }

    close(e) {
        console.log("Ngắt mất kết nối socket");

        // TODO: mất kết nối
    }

    send(data) {
        // TODO: Debug
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

    sendMessage(data) {
        this.send({
            ...data,
            time: new Date().toUTCString(),
            actionKey: CONF_SOCKET.actionKey.addMessage,
        })
    }

    sendCheckPingUsers() {
        this.send({
            actionKey: CONF_SOCKET.actionKey.checkPingUsers
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
}