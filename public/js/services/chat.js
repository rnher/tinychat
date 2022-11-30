
import { formatNoticationNumber } from "/public/js/util.js";
import { CONF_SOCKET } from "/public/js/config.js";
import Socket from "/public/js/services/socket.js";

window.Chat = (function () {
    let instance;
    function init(listen) {
        class Chat extends Socket {
            listen;
            listChatinfoID;
            listPingUsers;

            constructor(listen) {
                super();

                this.listen = listen;
                this.listChatinfoID = [];
                this.listPingUsers = [];
            }

            open(e) {
                super.open(e);
                // Ping lấy trạng thái người dùng online
                // this.sendCheckPingUsers();
            }

            message(e) {
                let data = this.deData(e.data);

                // DEBUG:
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
                    case CONF_SOCKET.actionKey.noticationPing: {
                        this.updatePingUsers(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.checkPingUsers: {
                        this.updatePingUsers(data.pings);
                    }
                        break;

                    case CONF_SOCKET.actionKey.addChatInfo: {
                        this.addChatInfo(data.item, this);
                    }
                        break;
                    case CONF_SOCKET.actionKey.updateSeen: {
                        this.updateSeen(data);
                    }
                        break;
                    case CONF_SOCKET.actionKey.login: {
                        if (typeof this.listen == "function") {
                            this.listen(data);
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
                    $("#tiny-chat").updateScrollBottomChatBoxView();
                }
            };

            addMSGNotication(data) {
                if ($("#message-textarea").data("chatinfo") != data.chatinfo_id) {
                    let badgeNewMSG = $(".chatinfo[data-id=" + data.chatinfo_id + "]").find(".badge-new-msg");
                    let objNum = formatNoticationNumber(badgeNewMSG.data("value"));
                    badgeNewMSG.data("value", objNum.num);
                    badgeNewMSG.text(objNum.display);

                    badgeNewMSG.show();
                } else {
                    this.sendSeen({
                        chatinfo_id: data.chatinfo_id
                    })
                }
            }

            updatePingUsers(data) {
                let _this = this;
                function update(data) {
                    // Cập nhật listPingUsers
                    let indexPingUser = _this.listPingUsers.findIndex(function (pingUser) {
                        if (pingUser.chatinfo_id == data.chatinfo_id) {
                            // Update ping data
                            pingUser.ping = data.ping;
                        }
                    });

                    // Thêm listPingUsers
                    if (indexPingUser == -1) {
                        _this.listPingUsers.push(data)
                    }
                }

                if (data.length) {
                    for (let i = 0; i < data.length; i++) {
                        update(data[i]);
                    }
                } else {
                    update(data);
                }

                this._updatePingUsers();
            }

            addChatInfo(data) {
                let chatInfoContent = $(".chat-info__content");
                // Ẩn thông báo lỗi
                chatInfoContent.find("error").remove();
                // Add chat info
                chatInfoContent.prepend($("#tiny-chat").createChatinfoItem({ data }));
                // Add add chat box
                $(".chat-box__content").append($("#tiny-chat").createChatView({ data: data.chatinfo }));
                // Ẩn nó, khi click mới hiện
                $(".chat-box__content[data-id=" + data.chatinfo.id + "]").hide();

                // Add vaof danh sách queue để sau này lấy online status
                this.listChatinfoID.push(data.chatinfo.id);

                // Kiểm tra ping users sau khi add
                this._updatePingUsers();
            };

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

            _updatePingUsers() {
                for (let i = 0; i < this.listPingUsers.length; i++) {
                    let pingUser = this.listPingUsers[i];

                    let indexPingUser = this.listPingUsers.findIndex(function (data) {
                        // Nếu có danh sách chờ ping users 
                        if (pingUser.chatinfo_id == data.chatinfo_id) {
                            let user = $(".chatinfo[data-id=" + pingUser.chatinfo_id + "]")
                                .find(".user-online");

                            if (pingUser.ping) {
                                user.addClass("badge-success");
                            } else {
                                user.removeClass("badge-success");
                            }

                            // Thoát
                            return;
                        }
                    });

                    // Xóa khỏi hàng đợi vì indexPingUser != 1. Có phần tử trong mảng
                    this.listPingUsers.slice(indexPingUser, 1);
                }
            }
        }

        return new Chat(listen);
    }

    return {
        getInstance: function (listen = null) {
            if (!instance) {
                instance = init(listen);
            }
            return instance;
        }
    }
})();