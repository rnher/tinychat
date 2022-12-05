import { CONF_SOCKET } from "/public/js/config.js";
import { getCookie } from "/public/js/util.js";

export default class Socket extends WebSocket {
    constructor() {
        super(CONF_SOCKET.host);

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
        // Đăng nhập socket
        this.sendLogin();
        // // Ping lấy trạng thái người dùng online
        // this.sendCheckPingUsers();
    }

    close(e) {
        console.log("Ngắt mất kết nối socket");

        // $("#tiny-chat").showAlert({
        //     type: "error",
        //     content: "Mất kết nối với máy chủ. Nhấn F5 để kết nối lại",
        //     id: "close-socket"
        // });
    }

    send(data) {
        // DEBUG:
        console.log("send" + data.actionKey);
        console.log(data);

        if (this.OPEN == this.readyState) {
            super.send(this.enData(data));
        } else if (this.CLOSED == this.readyState) {
            // $("#tiny-chat").showAlert({
            //     type: "error",
            //     content: "Mất kết nối với máy chủ. Nhấn F5 để kết nối lại",
            //     id: "close-socket"
            // });
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
        this.send({
            ...data,
            time: new Date(),
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