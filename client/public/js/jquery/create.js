
import "/client/public/js/services/rsa.js";
import { getDate } from "/client/public/js/util.js";
import { CONF_HOST, CONF_CHAT, CONF_APP } from "/client/public/js/config.js";

(function ($) {
    $.fn.createMessageItem = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;
        let dataContent = null;

        switch (data.type) {
            case CONF_CHAT.type.text: {
                data.content = data.is_decrypt ? data.content : RSA
                    .getInstance()
                    .decrypt(
                        data.chatinfo_id,
                        data.content
                    );

                dataContent = `<span>${data.content}</span>`;
            }
                break;
            case CONF_CHAT.type.img: {
                data.content = data.is_decrypt ? data.content : RSA
                    .getInstance()
                    .decryptImage(
                        data.chatinfo_id,
                        data.content
                    );
                dataContent = `<img atl="IMG" src="${data.content}"></img>`;
            }
                break;
            default: {
            }
                break;
        }

        let color = data.isSelf ? "client_chat_color" : "brand_chat_color";
        let bg = data.isSelf ? "client_chat_bg" : "brand_chat_bg";

        let user = `<div class="message-user" data-id="${data.id}">
                        <div class="user-avatar clearfix">
                            <img title="`+ data.userName + `" src="` + data.avatar + `" alt="` + data.userName + `">
                        </div> 
                    </div>`;
        let content = `<div class="message-content ${bg}">
                            <div class="content-msg ${color}">
                                ${dataContent}
                            </div>
                            <div class="content-info">
                                <div class="${color} content-time" data-value="` + data.time + `">
                                    ` + getDate(data.time, false, false) + `
                                </div>
                                <div class="${color} content-isseen tooltip">
                                    <i class="${color} fa-solid fa-check-double"></i>
                                    <span class="tooltipisseen">???? xem</span>
                                </div>
                            </div>
                        </div>`;

        return `<div class="message clearfix message-avatar ` + (data.isSelf ? "message-right" : "message-left") + `">
                    `+ (data.isSelf ? content : user) + `
                    `+ (data.isSelf ? user : content) + `
                </div>`;

    }

    $.fn.createTypingMessage = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        return `<div class="message typing-message clearfix message-avatar message-left">
                    <div class="message-user" data-pseudo="1" data-id="${data.id}">
                        <div title="${data.userName}" class="user-avatar clearfix">
                            <img src="` + data.avatar + `" alt="` + data.userName + `">
                        </div> 
                    </div>
                    <div class="message-content brand_chat_bg" title="??ang tr??? l???i">
                        <div class="typing-bubble">
                            <div class="typing">
                                <div class="dot brand_chat_color"></div>
                                <div class="dot brand_chat_color"></div>
                                <div class="dot brand_chat_color"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    $.fn.createMini404 = function (options) {
        let _this = this;

        let defaults = {
            text: "Xin l???i ???? l??m phi???n l??ng b???n",
            image: null
        };

        let settings = $.extend({}, defaults, options);

        return `<div class="error error-404 mini-error-404">
                    <div class="error-title">
                        <h1>Kh??ng t??m th???y !</h1>
                        <p>`+ settings.text + `</p>
                    </div>
                    <div class="error-content">
                    ${settings.image ? `<img src="${settings.image}" alt="${settings.text}">` : `<span>4</span>
                        <span><span class="screen-reader-text">0</span></span>
                        <span>4</span>`}
                    </div>
                   <!-- <div class="error-bottom">
                        <button class="btn-icon" title="T???i l???i"><i class="fa-solid fa-rotate"></i></button>
                    </div> -->
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
                content = "H???t tin nh???n";
            }
                break;
            case "chatinfo": {
                content = "H???t cu???c tr?? chuy???n";
            }
                break;
            default: {
                content = "H???t d??? li???u";
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

        let brand = settings.data.brand;

        let requirePhone = "";
        if (brand.settings && brand.settings.is_require_phone == "1") {
            requirePhone = `<div class="input-group">
                <input type="number" value="" name="phone" placeholder="S??? ??i???n tho???i c???a b???n" id="phone">
                <label class="label-error" data-name="phone" for="phone"></label>
                <label class="label-info" for="phone"></label>
            </div>`;
        }

        let requireMail = "";
        if (brand.settings && brand.settings.is_require_mail == "1") {
            requireMail = `<div class="input-group">
                <input type="text" value="" name="mail" placeholder="?????a ch??? mail" id="mail">
                <label class="label-error" data-name="mail" for="mail"></label>
                <label class="label-info" for="mail"></label>
            </div>`;
        }

        return `<div id="chat-box" class="register-chat">
                    <div class="nav-top">
                        <div class="register-coppyright">
                            <span>
                                B???n quy???n thu???c v??? 
                            </span>
                            <a href="${CONF_APP.main_host}" target="_blank">
                                <img class="logo" src="${CONF_HOST + "/public/images/app/logo.png"}" alt="logo">
                            </a>
                        </div>
                        <button title="Thu nh???" id="mini-size-chat">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                    </div>
                    <div class="register-title main_bg main_color">
                        <div class="register-title__name">
                            ${brand.name}
                        </div>
                        <div class="register-title__description">
                            ${brand.description}
                        </div>
                    </div>
                    <div class="register-content">
                        <div class="register-box">
                            <div class="customer-form">
                                <div class="form-header">
                                    <img class="logo" src="${brand.banner}" alt="${brand.banner}">
                                </div>
                                <div class="form-content">
                                    <form  id="register-chat__form" method="post">
                                        <div class="input-group">
                                            <input autofocus type="text" value="" name="name" placeholder="T??n c???a b???n" id="name">
                                            <label class="label-error" data-name="name" for="name"></label>
                                            <label class="label-info" for="name"></label>
                                        </div>
                                        ${requirePhone}
                                        ${requireMail}
                                        <div class="input-group inline-input-group checkbox-input-group">
                                            <input class="inline-input" id="remember" type="checkbox" name="remember">
                                            <label class="inline-input" for="remember">Ghi nh??? cu???c tr?? chuy???n</label>
                                        </div>
                                        <div class="input-group submit-input">
                                            <button class="btn btn-submit main_bg main_color" type="submit">H???i tho???i m???i</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }

    $.fn.createChatBox = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let brand = settings.brand;

        return `<div id="chat-box" class="chat-box registed-chat">
                    <div class="nav-top">
                        <div class="register-coppyright">
                            <span>
                                B???n quy???n thu???c v??? 
                            </span>
                            <a href="${CONF_APP.main_host}" target="_blank">
                                <img class="logo" src="${CONF_HOST + "/public/images/app/logo.png"}" alt="logo">
                            </a>
                        </div>
                        <button title="X??a cu???c tr?? chuy???n" id="delete-chat">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                        <button title="Th??ng b??o" id="notification-sound">
                            <i class="fa-regular fa-bell"></i>
                        </button>
                        <button title="Thu nh???" id="mini-size-chat">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                    </div>
                    <!-- main_bg -->
                    <div class="chat-box__head main_bg">
                        <!-- chatinfo -->
                        <div class="chatinfo chatinfo-avatar">
                            <div class="info-user">
                                <div class="user-avatar" title="${brand.name}">
                                    <img src="`+ brand.avatar + `" alt="` + brand.name + `">
                                    <div class="user-online" title="??ang ho???t ?????ng">
                                    </div>
                                </div>
                                <div class="info-content">
                                    <!-- brand_name_color -->
                                    <div class="user-name brand_name_color" title="${brand.name}">
                                        ` + brand.name + `
                                    </div>
                                    <!-- brand_text_color
                                    <div class="user-text brand_text_color" title="Th??ng tin li??n h???">
                                    </div>
                                    -->
                                </div>
                            </div>

                            <div class="info-action">
                                <button class="action-icon info-action__item" title="Thao t??c">
                                    <i class="fa-solid fa-ellipsis-vertical"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="chat-box__content">
                        <!-- chat_bg -->
                        <div class="chat-box__view chat_bg" data-id="`+ settings.chatinfo.id + `" data-next="` + settings.next_page_url + `">
                            <!-- D??? li???u messages load ??? ????y -->
                        </div>
                        <!-- main -->
                        <div id="chat-box__move-down" class="chat-box__move-down main_bg main_color" title="T???i tin nh???n m???i nh???t">
                            <i class="fa-solid fa-angles-down"></i>
                        </div>
                        <div class="chat-box__input">
                            <div class="chat-box__bar">
                                <button id="item-bar__emoji" class="item-bar" title="C???m x??c">
                                    <i class="fa-regular fa-face-smile"></i>
                                </button>
                                <!-- <button class="item-bar" title="T???p tin ????nh k??m">
                                    <i class="fa-solid fa-paperclip"></i>
                                </button> -->
                                 <button id="item-bar__image" data-target="item-bar__input-image" class="item-bar"
                                    title="H??nh ???nh ????nh k??m">
                                    <i class="fa-regular fa-image"></i>
                                </button>
                                <input id="item-bar__input-image" type="file" hidden multiple>
                                <div class="view-count-message" title="Gi???i h???n k?? t???">
                                    <span class="current-count-message" data-value="0">
                                    0
                                    </span>
                                    <span>
                                    /
                                    </span>
                                    <span class="max-count-message" data-value="225">
                                    225
                                    </span>
                                </div>
                            </div>
                            <form id="send-message__form" class="send-message__form" method="post">
                                <textarea 
                                    id="message-textarea" 
                                    class="message-textarea" 
                                    type="text" placeholder="Nh???p n???i dung tin nh???n"
                                    data-chatinfo="`+ settings.chatinfo.id + `"
                                    >
                                </textarea>
                                <button class="btn btn-submit main_bg main_color" type="submit" title="G???i">
                                    <i class="fa-solid fa-paper-plane"></i>
                                </button>
                            </form>
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
                
                    <!-- main -->
                    <div class="chat-bubble action-btn main_bg" data-action="toggle" data-target="chat-box">
                        <span 
                            class="edit-brand-name-color" 
                            data-color="" 
                            data-selectcolor="">
                        </span>
                        <span 
                            class="edit-brand-text-color" 
                            data-color="" 
                            data-selectcolor="">
                        </span>
                        <span 
                            class="edit-brand-content" 
                            data-color="" 
                            data-selectcolor="" 
                            data-bg="" 
                            data-selectbg="">
                        </span>
                        <span 
                            class="edit-customer-content" 
                            data-color="" 
                            data-selectcolor="" 
                            data-bg="" 
                            data-selectbg="">
                        </span>
                        <span 
                            class="edit-main" 
                            data-selectcolor="" 
                            data-bg="" 
                            data-selectbg="" 
                            data-text="" 
                            data-selecttext="" 
                            data-icon=""
                            data-selecticon="">
                        </span>
                        <span 
                            class="edit-chat-bg" 
                            data-bg=""
                            data-selectbg="">
                        </span>
                        <span 
                        class="main_icon 
                        main_color">
                            <i class="fa-solid fa-message"></i>
                        </span>
                        <span class="main_text main_color">Chat</span>
                        <div class="status-badge badge-danger badge-new-msg" data-value title="Tin nh???n ch??a ?????c">
                        </div>
                    </div>
                </div>`;
    }

    $.fn.createLoader = function (options) {
        let _this = this;

        let defaults = {
            type: null,
            color: null
        };

        let settings = $.extend({}, defaults, options);

        let content = null;
        switch (settings.type) {
            case "message": {
                content = "??ang t???i tin nh???n";
            }
                break;
            case "chatinfo": {
                content = "??ang t???i cu???c tr?? chuy???n";
            }
                break;
            case "socket": {
                content = "??ang k???t n???i v???i m??y ch???";
            }
                break;
            default: {
                content = "??ang t???i d??? li???u";
            }
                break;
        }
        return `<div class="alert-${settings.color} loader-blur clearfix loader-socket">
                    <div class="circle-loader"><span></span></div> ${content}
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

        return ` <div id="` + settings.id + `" class="alert ` + settings.type + `-alert" data-name="` + settings.name + `">
                    <div class="alert-icon">
                        `+ icon + `
                    </div>
                    <div class="alert-content">
                        `+ settings.content + `
                    </div>
                    <div    class="alert-action"
                            data-target="`+ settings.id + `" 
                            data-action="close" 
                            data-value="alert" 
                            title="X??a th??ng b??o"
                    >
                        <i class="fa-solid fa-xmark">
                        </i>
                    </div>
                </div>`;
    }

    $.fn.createNewMSGBadge = function (options) {
        let _this = this;

        let defaults = {
            text: "Tin nh???n m???i"
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        return `<div class="new-msg-badge">
                   ${settings.text}
                </div>`;
    }

    $.fn.createChatBoxViewDateLabel = function (options) {
        let _this = this;

        let defaults = {

        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        return `<div class="chat-box-view__date-label clearfix" 
                     data-value="${settings.rawDate}">
                    ${settings.date}
                </div>`;
    }
})(jQuery);
