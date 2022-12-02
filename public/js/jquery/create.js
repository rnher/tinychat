
import { formatNoticationNumber, getDate } from "/client/public/js/util.js";

(function ($) {

    $.fn.createChatView = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        return `<div class="chat-box__view" data-id="` + data.id + `" data-next="">`;
    }

    $.fn.createChatinfoItem = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        let customer = data.customer;
        let chatinfo = data.chatinfo;
        let notication = formatNoticationNumber(data.count_not_seen_msg.count, 0);

        return `<div class="chatinfo chatinfo-avatar" data-id="` + chatinfo.id + `">
                <div class="info-user">
                    <div class="user-avatar">
                        <img src="`+ customer.avatar + `" alt="` + customer.name + `">
                        <div class="user-online" title="Đang hoạt động">
                        </div>
                    </div>
                    <div>
                        <div class="user-name">
                        ` + customer.name + `
                        </div>
                        <div class="user-phone" title="Số điện thoại liên hệ">
                        `+ customer.phone + `
                        </div>
                    </div>
                </div>
            
                <div class="info-action">
                    <div `+ (notication.num ? "" : "hidden") + ` class="badge-danger badge-new-msg" data-value="` + notication.num + `" title="Tin nhắn chưa đọc">
                        `+ notication.display + `
                    </div>
                    <div class="action-icon" title="Thao tác">
                        <i class="fa-solid fa-bars"></i>
                    </div>
                </div>
            </div>`;
    }

    $.fn.createMessageItem = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        let user = `<div class="messenger-user">
                        <div class="user-avatar clearfix">
                            <img title="`+ data.userName + `" src="` + data.avatar + `" alt="` + data.userName + `">
                        </div> 
                    </div>`;
        let content = `<div class="messenger-content">
                            <div class="content-msg">
                            `+ data.content + `
                            </div>
                           <div class="content-info">
                                <div class="content-time" data-value="`+ data.time + `">
                                ` + getDate(data.time) + `
                                </div>
                                <div class="content-isseen tooltip">
                                    <i class="fa-solid fa-check-double"></i>
                                    <span class="tooltipisseen">Đã xem</span>
                                </div>
                           </div>
                        </div>`;

        return `<div class="message clearfix message-avatar ` + (data.isSelf ? "message-right" : "message-left") + `">
                    `+ (data.isSelf ? content : user) + `
                    `+ (data.isSelf ? user : content) + `
                </div>`;
    }


    $.fn.createMini404 = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        return `<div class="error error-404 mini-error-404">
                    <div class="error-title">
                        <h1>Không tìm thấy !</h1>
                        <p>Xin lỗi đã làm phiền lòng bạn</p>
                    </div>
                    <div class="error-content">
                        <span>4</span>
                        <span><span class="screen-reader-text">0</span></span>
                        <span>4</span>
                    </div>
                    <div class="error-bottom">
                        <button class="btn-icon" title="Tải lại"><i class="fa-solid fa-rotate"></i></button>
                    </div>
                </div>`;

    }

    $.fn.createAlert = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let icon;
        switch (settings.type) {
            case "error": {
                icon = `<i class="fa-solid fa-circle-exclamation"></i>`;
            }
                break;
            case "success": {
                icon = `<i class="fa-regular fa-circle-check"></i>`;
            }
                break;
            case "info": {
                icon = `<i class="fa-regular fa-circle-question"></i>`;
            }
                break;
            default: {
            }
                break;
        }

        return ` <div id="` + settings.id + `" class="alert ` + settings.type + `-alert">
                    <div class="alert-icon">
                        `+ icon + `
                    </div>
                    <div class="alert-content">
                        `+ settings.content + `
                    </div>
                    <div class="alert-action">
                        <i class="fa-solid fa-xmark action-btn" 
                            data-target="`+ settings.id + `" 
                            data-action="close" 
                            data-value="alert" 
                            title="Xóa thông báo">
                        </i>
                    </div>
                </div>`;
    }

    $.fn.createOutOfData = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let content = null;
        switch (settings.type) {
            case "message": {
                content = "Hết tin nhắn";
            }
                break;
            case "chatinfo": {
                content = "Hết cuộc trò chuyện";
            }
                break;
            default: {
                content = "Hết dữ liệu";
            }
                break;
        }
        return ` <div class="out-of-data">` + content + `</div>`;
    }

})(jQuery);
