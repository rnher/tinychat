
import "/public/js/libraries/jquery-3.6.1.js";
import { formatNoticationNumber, getDate, uniqId } from "/public/js/util.js";
import { CONF_CHAT } from "/public/js/config.js";
import "/public/js/services/rsa.js";

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
        let re_message = data.re_message;
        let notication = formatNoticationNumber(re_message.count_not_seen, 0);
        let newChatinfo = chatinfo.is_seen_brand == 1 ? "" : `<div class="badge-new clearfix" title="Hãy bắt đầu trò chuyện với khách hàng">Mới</div>`;

        return `<div class="chatinfo chatinfo-avatar" data-seen=${chatinfo.is_seen_brand} data-id="` + chatinfo.id + `" 
                    data-name="${customer.name}"
                    data-phone="${customer.phone}"
                    data-mail="${customer.mail}"
                    data-createdate="${customer.create_date}"
                >
                    <div class="info-user">
                        <div class="user-avatar">
                            <img src="`+ customer.avatar + `" alt="` + customer.name + `">
                            <div class="user-online">
                            </div>
                        </div>
                        <div class="info-content">
                            <div class="user-name" title="${customer.name}">
                            ` + customer.name + ` 
                            </div>
                            <div class="user-text">
                                <span class="content"></span>
                            </div>
                            <div class="date-content">
                                <span></span>
                                ${newChatinfo}
                            </div>
                        </div>
                    </div>
                    <div class="info-action">
                        <div `+ (notication.num ? "" : "hidden") + ` class="badge-danger badge-new-msg info-action__item" data-value="` + notication.num + `" title="Tin nhắn chưa đọc">
                            `+ notication.display + `
                        </div>
                        <button class="action-icon info-action__item" title="Thao tác">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                    </div>
                </div>`;
    }

    $.fn.createMessageItem = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;
        let dataContent = null;

        switch (data.type) {
            case CONF_CHAT.type.text: {
                data.content = RSA
                    .getInstance()
                    .decrypt(
                        data.chatinfo_id,
                        data.content
                    );

                dataContent = `<span>${data.content}</span>`;
            }
                break;
            case CONF_CHAT.type.img: {
                data.content = RSA
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

        let self = data.isSelf || data.isBrandSelf;
        let user = `<div class="message-user" data-id="${data.id}">
                        <div class="user-avatar clearfix">
                            <img title="`+ data.userName + `" src="` + data.avatar + `" alt="` + data.userName + `">
                        </div> 
                    </div>`;
        let content = `<div class="message-content">
                            <div class="content-msg">
                                ${dataContent}
                            </div>
                           <div class="content-info">
                                <div class="content-time" data-value="`+ data.time + `">
                                ` + getDate(data.time, false, false) + `
                                </div>
                                <div class="content-isseen tooltip">
                                    <i class="fa-solid fa-check-double"></i>
                                    <span class="tooltipisseen">Đã xem</span>
                                </div>
                           </div>
                        </div>`;
        let messageBeside = self ? "message-right" : "message-left";

        return `<div class="message clearfix message-avatar ${messageBeside}">
                    `+ (self ? content : user) + `
                    `+ (self ? user : content) + `
                </div>`;
    }

    $.fn.createTypingMessage = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;
        let self = data.isSelf || data.isBrandSelf;
        let messageBeside = self ? "message-right" : "message-left";
        let user = `<div class="message-user" data-pseudo="1" data-id="${data.id}">
                        <div title="${data.userName}" class="user-avatar clearfix">
                            <img src="` + data.avatar + `" alt="` + data.userName + `">
                        </div> 
                    </div>`;
        let content = `<div class="message-content" title="Đang trả lời">
                            <div class="typing-bubble">
                                <div class="typing">
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                </div>
                            </div>
                        </div>`;

        return `<div class="message typing-message clearfix message-avatar ${messageBeside}">
                    ${self ? content : user}          
                    ${self ? user : content}       
                </div>`;
    }


    $.fn.createTypingBubble = function (options) {
        let _this = this;

        let defaults = {
            title: ""
        };

        let settings = $.extend({}, defaults, options);

        return `<div class="typing-bubble" title="${settings.title}">
                    <div class="typing">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;
    }

    $.fn.createMini404 = function (options) {
        let _this = this;

        let defaults = {
            text: "Xin lỗi đã làm phiền lòng bạn",
            image: null
        };

        let settings = $.extend({}, defaults, options);

        if (settings.type) {
            switch (settings.type) {
                case "chatinfo":
                    settings.text = "Không có cuộc trò chuyện";
                    break;
                case "member":
                    settings.text = "Không có thành viên";
                    break;
                default:
                    break;
            }
        }
        return `<div class="error ${settings.image ? `error-image` : ``} error-404 mini-error-404">
                    <div class="error-title">
                        <h1>Không tìm thấy !</h1>
                        <p>${settings.text}</p>
                    </div>
                    <div class="error-content">
                        ${settings.image ? `<img src="${settings.image}" alt="${settings.text}">` : `<span>4</span>
                        <span><span class="screen-reader-text">0</span></span>
                        <span>4</span>`}
                    </div>
                <!-- <div class="error-bottom">
                        <button class="btn-icon" title="Tải lại"><i class="fa-solid fa-rotate"></i></button>
                    </div> -->
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
                            title="Xóa thông báo"
                    >
                        <i class="fa-solid fa-xmark">
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
            case "notification": {
                content = "Hết thông báo";
            }
                break;
            default: {
                content = "Hết dữ liệu";
            }
                break;
        }
        return ` <div class="out-of-data">` + content + `</div>`;
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
            case "notification": {
                content = "Đang tải thông báo";
            }
                break;
            case "message": {
                content = "Đang tải tin nhắn";
            }
                break;
            case "chatinfo": {
                content = "Đang tải cuộc trò chuyện";
            }
                break;
            case "socket": {
                content = "Đang kết nối với máy chủ";
            }
                break;
            default: {
                content = "Đang tải dữ liệu";
            }
                break;
        }
        return `<div class="alert-${settings.color} loader-blur clearfix loader-socket">
                    <div class="circle-loader"><span></span></div> ${content}
                </div>`;
    }

    $.fn.createChatinfoMenu = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let tooltiptextView = `<div class="tooltiptext tooltiptext-table">
                                <div>Tên : <span>${settings.name != "null" ? settings.name : "Không được cung cấp"}<span></div>
                                <div>Email : <span>${settings.mail != "null" ? settings.mail : "Không được cung cấp"}<span></div>
                                <div>Phone : <span>${settings.phone != "null" ? settings.phone : "Không được cung cấp"}<span></div>
                                <div>Ngày kết nối : <span>${getDate(settings.create_date, true)}<span></div>
                            </div>`;

        return `<div class="chatinfo-menu ">
                    <div class="chatinfo-menu__item chatinfo-menu__item-block" title="Bạn sẽ không còn thấy cuộc trò chuyện này trong tương lai">
                        <i class="fa-solid fa-user-slash"></i>Khóa
                    </div>
                    <div class="tooltip chatinfo-menu__item chatinfo-menu__item-view" title="">
                        <i class="fa-solid fa-circle-info"></i>Thông tin
                        ${tooltiptextView}
                    </div>
                </div>`;
    }

    $.fn.createBrandItem = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let brand = settings.data;

        return `<div class="brand" data-id="` + brand.id + `">
                    <div class="chat-menu__item user-avatar" title="${brand.name}">
                        <img src="${brand.avatar}" alt="${brand.name}">
                        <div class="badge-danger brand-notification" data-value=0 title="Thông báo">
                        </div>
                    </div>
                    <div class="info-content">
                        <div class="user-name" title="${brand.name}">
                        ${brand.name}
                        </div>
                    </div>
                </div>`;
    }

    $.fn.createListChatInfo = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let brand = settings.data;

        return `<div class="chat-info__list-chatinfo" data-id="${brand.id}" data-next=>
                </div>`;
    }

    $.fn.createListChatBoxContent = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let brand = settings.data;

        return `<div class="chat-box__content-list" data-id="${brand.id}">
                </div>`;
    }

    $.fn.createSettingsBrand = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let brand = settings.data;

        return `<form id="settings-brand__form" method="post">
                    <div class="input-group">
                        <div class="avatar-image">
                            <label for="input-brand-avatar">
                                <input id="input-brand-avatar" class="input-avatar" data-target="brand-avatar" type="file" name="avatar" hidden>
                                <div id="review-brand-avatar-image" class="review-avatar-image review-image" data-target="input-brand-avatar">
                                    <img id="brand-avatar" src="${brand.avatar}" alt="${brand.name}" data-self="1" title="Cập nhật ảnh mới">
                                </div>
                            </label>
                        </div>
                        <label class="label-error" data-name="avatar" for="input-brand-avatar"></label>
                        <label class="label-info" for="input-brand-avatar"></label>
                    </div>

                    <div class="input-group">
                        <label class="label-title" for="name">Tên thương hiệu *</label>
                        <input type="text" value="${brand.name}" name="name" placeholder="Tên thương hiệu" id="name" autofocus>
                        <label class="label-error" data-name="name" for="name"></label>
                        <label class="label-info" for="name"></label>
                    </div>

                    <div class="input-group">
                        <label class="label-title" for="description">Mô tả thương hiệu *</label>
                        <input type="text" value="${brand.description}" name="description" placeholder="Mô tả thương hiệu" id="description">
                        <label class="label-error" data-name="description" for="description"></label>
                        <label class="label-info" for="description"></label>
                    </div>

                    <div class="input-group">
                        <label class="label-title" for="greeting">Lời chào thương hiệu</label>
                        <input type="text" value="${brand.greeting}" name="greeting" placeholder="Lời chào thương hiệu" id="greeting">
                        <label class="label-error" data-name="greeting" for="greeting"></label>
                        <label class="label-info" for="greeting"></label>
                    </div>

                    <div class="input-group">
                        <label class="label-title" for="domain">Tên miền trang web</label>
                        <input type="text" value="${brand.domain}" placeholder="Tên miền trang web" name="domain" id="domain">
                        <label class="label-error" data-name="domain" for="domain"></label>
                        <label class="label-info" for="domain"></label>
                    </div>
                    <div class="input-group">
                        <label class="label-title" for="token">Mã nhúng</label>
                        <div id="token__input-group" class="action__input-group">
                            <input type="text" value="${brand.token}" placeholder="Mã nhúng" name="token" id="token" disabled>
                            <button class="clipboard-btn" data-target="token" type="button" title="Sao chép mã"><i class="fa-regular fa-clipboard"></i></button>
                        </div>
                        <label class="label-error" data-name="token" for="token"></label>
                        <label class="label-info" for="token">Mã của bạn hết hạn ngày :
                        ${getDate(brand.expire)}.</label>
                    </div>

                    <div class="input-group">
                        <label class="label-title">Mật khẩu hiện tại</label>
                        <input type="password" value="" placeholder="Mật khẩu hiện tại" name="password" id="password">
                        <label class="label-error" data-name="password" for="password"></label>
                        <label class="label-info">Xác nhận mật khẩu trước khi
                            lưu.</label>
                    </div>

                    <div class="input-group submit-input">
                        <label class="label-error text-center" data-name="is" for="is"></label>
                        <button class="btn btn-submit" type="submit">Cập nhật</button>
                    </div>
                </form>
        `;
    }

    $.fn.createBrandSelectOption = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        return `<div class="option" data-id="${data.id}">
                    <input class="s-c top" type="radio" name="platform" value="${data.id}">
                    <input class="s-c bottom" type="radio" name="platform" value="${data.id}">
                    <img src="${data.avatar}" alt="${data.name}">
                    <span class="label">${data.name}</span>
                    <span class="opt-val">${data.name}</span>
                </div>`;
    }

    $.fn.createPopup = function (options) {
        let _this = this;

        let defaults = {
            id: uniqId(),
            className: ""
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        let bottom = `<div class="popup-bottom">
                        <button id="popup__reject-btn" class="btn-icon reject-btn" title="Từ chối">
                            <i class="fa-solid fa-xmark"></i> Từ chối
                        </button>
                        <button id="popup__accept-btn" class="btn-icon accept-btn" title="Đồng ý">
                            <i class="fa-solid fa-check"></i> Chấp nhận
                        </button>
                    </div>`;

        return `<div class="popup ${settings.className}" id="popup-${settings.id}">
                    <div class="popup-head">
                        <div class="head-title">
                            ${settings.title}
                        </div>
                        <div class="head-action">
                            <button id="popup__close-btn" class="btn-icon popup__close-btn" data-target="popup-${settings.id}" title="Đóng">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                    <div class="popup-content">
                    ${settings.content}
                    </div>
                    ${settings.showAction
                ? bottom
                : `<div class="popup-bottom">
                            </div>`
            }
                </div>`;
    }

    $.fn.createAddBrand = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        return `<form id="create-brand__form" method="post" >
                    <div class="input-group">
                        <label class="label-title" for="name">Tên thương hiệu *</label>
                        <input autofocus type="text" value="" name="name" placeholder="" id="name">
                        <label class="label-error" data-name="name" for="name"></label>
                        <label class="label-info" for="name"></label>
                    </div>
                    <div class="input-group">
                        <label class="label-title" for="description">Mô tả thương hiệu *</label>
                        <input type="text" value="" placeholder="" name="description" id="description">
                        <label class="label-error" data-name="description" for="description"></label>
                        <label class="label-info" for="description"></label>
                    </div>
                    <div class="input-group submit-input">
                        <button class="btn btn-submit" type="submit">Tạo</button>
                    </div>
                </form >`;
    }

    $.fn.createMemberItem = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let isAdmin = settings.isAdmin;
        let member = settings.data;

        let adminIcon = member.role == 1 ? `<i class="fa-solid fa-crown"></i>` : "";
        let status = "";
        switch (parseInt(member.status, 10)) {
            case 1:
                status = `<span class="status status-active" title="${getDate(member.create_date)}">Hoạt động</span>`
                break;
            case 0:
                status = `<span class="status status-pendding" title="Trạng thái thành viên">Chờ phản hồi</span>`
                break;
            case -1:
                status = `<span class="status status-not-active" title="Trạng thái thành viên">Đã từ chối</span>`
                break;
            default:
                break;
        }
        let memu = (adminIcon || !isAdmin) ? "" : `<div class="profile-item-menu__item profile-item-menu__item-remove" title="Xóa thành viên ra khỏi hệ thống thương hiệu">
                                                        <i class="fa-solid fa-user-xmark"></i>Xóa
                                                    </div>`;

        return `<div class="member profile-item profile-item-avatar" data-id="` + member.id + `" data-brandid="` + member.brand_id + `">
                <div class="info-user">
                    <div class="user-avatar" title="${member.name}">
                        <img src="`+ member.avatar + `" alt="` + member.name + `">
                        <div class="user-online" title="Đang hoạt động">
                        </div>
                    </div>
                    <div class="info-content">
                        <div class="user-name" title="Tên thành viên">
                        ${member.name} <span class="role-icon" title="Quản trị viên">${adminIcon}</span>
                        </div>
                        <div class="user-text" title="Thông tin liên hệ">
                        `+ member.mail + `
                        </div>
                    </div>
                </div>
                <div class="profile-item-menu">
                    ${status}
                    ${memu}
                </div>
            </div>`;
    }

    $.fn.createAddMember = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let data = settings.data;

        return `<form id="add-member__form" method="post" >
                    <input hidden disabled type="text" value="${data.brandID}" name="brandID" placeholder="" id="brandID">
                    <div class="input-group">
                        <label class="label-title" for="brandName">Thương hiệu</label>
                        <input disabled type="text" value="${data.brandName}" name="brandName" placeholder="" id="brandName">
                        <label class="label-error" data-name="brandName" for="brandName"></label>
                        <label class="label-info" for="brandName"></label>
                    </div>
                    <div class="input-group">
                        <label class="label-title" for="mail">Mail thành viên *</label>
                        <input autofocus type="mail" value="" name="mail" placeholder="" id="mail">
                        <label class="label-error" data-name="mail" for="mail"></label>
                        <label class="label-info" for="mail"></label>
                    </div>
                    <div class="input-group submit-input">
                        <button class="btn btn-submit" type="submit">Thêm</button>
                    </div>
                </form >`;
    }

    $.fn.createNotificationItem = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        let notification = settings.notification;

        let response = ((notification.is_response == 0)
            && (notification.action != 2)) ? `<div class="notification-item__action-item notification-item__action-item__accept" title="Chấp nhận">
                                                <i class="fa-solid fa-check"></i>
                                            </div>
                                            <div class="notification-item__action-item notification-item__action-item__reject" title="Từ chối">
                                                <i class="fa-solid fa-xmark"></i>
                                            </div>` : ``;

        let avatarIcon = null;
        switch (notification.type) {
            case "11":
                avatarIcon = `<i class="fa-regular fa-comments"></i>`;
                break;
            case "22":
                avatarIcon = `<i class="fa-solid fa-shop"></i>`;
                break;
            default:
                break;
        }

        return `<div class="notification-item ${notification.is_seen == 0 ? "unread" : ""}" data-id="${notification.id}">
                    <div class="notification-item__avatar">
                        <img src="${notification.target_avatar}" alt="${notification.target_name}" title="${notification.target_name}">
                        <div class="notification-item__avatar-icon">
                            ${avatarIcon}
                        </div>
                    </div>
                    <div class="notification-item__content">
                        <div class="notification-item__content-title">${notification.content}</div>
                        <div class="notification-item__content-content">
                            <div 
                            class="notification-item__content-date" 
                            data-value="${notification.create_date}" 
                            title="${notification.create_date}">
                                ${getDate(notification.create_date)}
                            </div>
                            <div class="notification-item__content-actions">
                                ${response}
                                <div class="notification-item__action-item notification-item__action-item__view" title=" ${notification.is_seen == 0 ? "Đánh dấu đã xem" : "Đánh dấu chưa xem"}">
                                ${notification.is_seen == 0 ? `<i class="fa-regular fa-eye"></i>` : `<i class="fa-regular fa-eye-slash"></i>`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }


    $.fn.createEditLayoutChatPopup = function (options) {
        let _this = this;

        let defaults = {
            title: "",
            isColor: true,
            color: "",
            isBg: true,
            bg: "",
            id: uniqId()
        };

        let settings = $.extend({}, defaults, options);

        return `<div id="${"edit-layout-chat-popup" + settings.id}" class="popup edit-layout-chat-popup">
                    <div class="popup-head">
                        <div class="head-title">
                            ${settings.title}
                        </div>
                        <div class="head-action">
                            <button class="edit-layout-chat-popup-close__btn btn-icon action-btn" data-target="${"edit-layout-chat-popup" + settings.id}" data-action="close" title="Đóng">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                    <div class="popup-content">
            ${settings.isBg ?
                `<div class="input-group">
                                <label class="label-title" for="bg">Màu nền</label>
                                <input class="pickercolor pickercolor-bg" type="text" name="bg" placeholder="Màu nền" id="bg">
                                <label class="label-error" data-name="bg" for="bg"></label>
                                <label class="label-info" for="bg"></label>
                            </div>`
                : ``
            }
            ${settings.isColor ?
                `<div class="input-group">
                                <label class="label-title" for="color">Màu chữ</label>
                                <input class="pickercolor pickercolor-color" type="text" name="color" placeholder="Màu chữ" id="color">
                                <label class="label-error" data-name="color" for="color"></label>
                                <label class="label-info" for="color"></label>
                            </div>`
                : ``
            }
                    </div>
                    <div class="popup-bottom">
                        <button id="edit-layout-chat-reset-btn" class="btn" data-target="${"edit-layout-chat-popup" + settings.id}">
                            Khôi phục
                        </button>
                    </div>
                </div>`;
    }

    $.fn.createNewMSGBadge = function (options) {
        let _this = this;

        let defaults = {
            text: "Tin nhắn mới"
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

    $.fn.createSearchInput = function (options) {
        let _this = this;

        let defaults = {
            placeholder: "",
            className: "",
            id: ""
        };

        let settings = $.extend({}, defaults, options);

        return `<div class="input-group input-group_search ${settings.className}">
                    <div class="input-icon">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <input id="${settings.id}" class="search-input" type="text" placeholder="${settings.placeholder}">
                </div>`;
    }

    $.fn.createSelectInput = function (options) {
        let _this = this;

        let defaults = {
            title: "",
            className: "",
            id: "",
            placeholder: ""
        };

        let settings = $.extend({}, defaults, options);

        return `<div id="${settings.id}" class="${settings.className} select-box">
                    <input type="checkbox" class="options-view-button" title="${settings.title}">
                    <div class="select-button">
                        <div class="selected-value">
                            <span>${settings.placeholder}</span>
                        </div>
                        <div class="chevrons">
                            <i class="fas fa-chevron-up"></i>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                    <div class="options">
                       
                    </div>
                </div>`;
    }


    $.fn.createSelectOption = function (options) {
        let _this = this;

        let defaults = {
            value: "",
            name: "",
            image: null,
            icon: null
        };

        let settings = $.extend({}, defaults, options);

        return `<div class="option" data-id="${settings.value}">
                    <input class="s-c top" type="radio" name="platform" value="${settings.value}">
                    <input class="s-c bottom" type="radio" name="platform" value="${settings.value}">
                    ${settings.image ? `<img src="${settings.image.src}" alt = "${settings.name}" >` : ``}
                    <span class="label" > ${settings.icon ? settings.icon : ``} ${settings.name}</span>
                    <span class="opt-val">  ${settings.icon ? settings.icon : ``} ${settings.name}</span>
                </div > `;
    }

    $.fn.createPreTable = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        return {
            checkboxInput: (className, name = null, id = null) => $(`<input type="checkbox" class="${className}" ${name ? `name="${name}"` : ""} ${id ? `id="${id}"` : ""}>`),
            createTable: (className = null) => $(`<table class="${className ? className : ``}"></table>`),
            createTr: (className = null) => $(`<tr class="${className ? className : ``}"></tr>`),
            createTh: (data) => $(`<th data-value=${data.value}>${data.name}</th>`),
            createTd: (data, is_append = false) => {
                let td = $(`<td ${data.data}>${is_append ? "" : data.content}</td>`);
                return is_append ? td.append(data.content) : td;
            },
            createUser: (data) => {
                return $(`  <div class="user-td">
                                <img src="${data.avatar}" alt="${data.name}">
                                <div class="user-td__group">
                                    ${data.name ? `<div title="${data.name}" class="user-td__group-item">${data.name}</div>` : ""}
                                    ${data.mail ? `<div title="${data.mail}" class="user-td__group-item">${data.mail}</div>` : ""}
                                </div>
                            </div>`);
            }
        }
    }

    $.fn.createStatusBadge = function (options) {
        let _this = this;

        let defaults = {
            status: 1,
        };

        let settings = $.extend({}, defaults, options);

        let data = {};
        switch (settings.status) {
            case 1: {
                data = {
                    status: "active",
                    text: "Đang hoạt động"
                }
            }
                break;
            case 0: {
                data = {
                    status: "not-active",
                    text: "Không hoạt động"
                }
            }
                break;
            default:
                break;
        }

        return `<div class="status status-${data.status}">
                    ${data.text}
                </div>`;

    }


})(jQuery);
