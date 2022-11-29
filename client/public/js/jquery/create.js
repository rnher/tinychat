
import { getDate } from "/public/js/util.js";
import { CONF_HOST } from "/client/public/js/config.js";

(function ($) {
    $.fn.createMessageItem = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        let user = `<div class="messenger-user">
                        <div class="user-avatar clearfix">
                            <img title="`+ data.name + `" src="` + data.avatar + `" alt="` + data.name + `">
                        </div> 
                    </div>`;
        let content = `<div class="messenger-content">
                            <div class="content-msg">
                            `+ data.msg + `
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
            text: "Xin lỗi đã làm phiền lòng bạn"
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        return `<div class="error error-404 mini-error-404">
                    <div class="error-title">
                        <h1>Không tìm thấy !</h1>
                        <p>`+ settings.text + `</p>
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

    $.fn.createRegisterChat = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        return `<div id="chat-box" class="register-chat">
                    <div class="register-title">
                        <div>
                            Xin chào 👋
                        </div>
                        <span>
                            Chúng tôi sẵn sàng trợ giúp. Hãy hỏi bất cứ điều gì hoặc chia sẻ phản hồi của bạn.
                        </span>
                    </div>
                    <div class="register-content">
                        <div class="register-box">
                            <div class="customer-form">
                                <div class="form-header">
                                    <img class="logo" src="`+ CONF_HOST + `/public/images/app/logo.svg" alt="">
                                    <label class="label-error" data-name="is"></label>
                                </div>
                                <div class="form-content">
                                    <form  id="register-chat__form" method="post">
                                        <div class="input-group">
                                            <input autofocus type="text" value="" name="name" placeholder="Tên của bạn" id="name">
                                            <label class="label-error" data-name="name" for="name"></label>
                                            <label class="label-info" for="name"></label>
                                        </div>
                                        <div class="input-group">
                                            <input type="number" value="" name="phone" placeholder="Số điện thoại của bạn" id="phone">
                                            <label class="label-error" data-name="phone" for="phone"></label>
                                            <label class="label-info" for="phone"></label>
                                        </div>

                                        <div class="input-group submit-input">
                                            <button class="btn btn-submit" type="submit">Hội thoại mới</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="register-coppyright">
                        <span>
                            Bản quyền thuộc về #
                        </span>
                        <a href="#">
                            <img class="logo" src="`+ CONF_HOST + `/public/images/app/logo.svg" alt="">
                        </a>
                    </div>
                </div>`;
    }

    $.fn.createChatBox = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let brand = settings.users.brand;

        return `<div id="chat-box" class="chat-box">
                    <div class="chat-box__head">
                        <!-- chatinfo -->
                        <div class="chatinfo chatinfo-avatar">
                            <div class="info-user">
                                <div class="user-avatar">
                                    <img src="`+ brand.avatar + `" alt="` + brand.name + `">
                                    <div class="user-online" title="Đang hoạt động">
                                    </div>
                                </div>
                                <div>
                                    <div class="user-name">
                                        ` + brand.name + `
                                    </div>
                                    <div class="user-phone" title="">
                                        <!-- todo -->
                                    </div>
                                </div>
                            </div>

                            <div class="info-action">
                                <div class="badge-new-msg" data-value="0" title="">
                                    <!-- todo -->
                                </div>
                                <div class="action-icon" title="Thao tác">
                                    <i class="fa-solid fa-bars"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-box__content">
                        <div class="chat-box__view" data-id="`+ settings.chatinfo_id + `" data-next="` + settings.next_page_url + `">
                            <!-- Dữ liệu messages load ở đây -->
                        </div>
                        <div id="chat-box__move-down" class="chat-box__move-down">
                            <i class="fa-solid fa-angles-down"></i>
                        </div>
                        <div class="chat-box__input">
                            <textarea 
                                id="message-textarea" 
                                class="message-textarea" 
                                type="text" placeholder="Gửi tin nhắn"
                                data-chatinfo="`+ settings.chatinfo_id + `"
                                >
                            </textarea>
                        </div>
                    </div>
                </div>`;
    }

    $.fn.createChatBubble = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        return `<div id="client-tiny-chat">
                    <!-- chat-box -->
                
                    <!-- register-chat -->
                
                    <div class="chat-bubble" data-action="toggle" data-target="chat-box">
                        <img class="chat-bubble_avatar" src="`+ CONF_HOST + `/public/images/defaults/chat-bubble-avatar.jpg" alt="">
                        <div class="status-badge badge-danger badge-new-msg" data-value title="Tin nhắn chưa đọc">
                        </div>
                    </div>
                </div>`;
    }
})(jQuery);
