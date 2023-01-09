import "/public/js/libraries/jquery-3.6.1.js";
import "/public/js/jquery/util.js";
import { CONF_URL, CONF_APP } from "/public/js/config.js";
import { formatNoticationNumber, getDate } from "/public/js/util.js";
import "/public/js/jquery/create.js";

(function ($) {
    $.fn.processNotification = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            function Type(type) {
                switch (type) {
                    // room = 1
                    case "room_group":
                        return "11";
                        break;
                    // brand = 2
                    case "brand_member":
                        return "22";
                        break;
                    default:
                        return "0";
                        break;
                }
            }

            function Action(action) {
                switch (action) {
                    case "question":
                        return "1";
                        break;
                    case "view":
                        return "2";
                        break;
                    default:
                        return "0";
                        break;
                }
            }

            function ContentCode(content_code) {
                switch (content_code) {
                    case "invite":
                        return "1";
                        break;
                    default:
                        return "0";
                        break;
                }
            }

            let notification = settings.data.notification;
            if (notification) {
                switch (notification.type) {
                    case Type("brand_member"): {
                        switch (notification.content_code) {
                            // Mời vào
                            case ContentCode("invite"): {
                                switch (notification.type) {
                                    case Type("brand_member"): {
                                        let result = settings.data.result;

                                        if (notification.is_result == "1") {
                                            _this.loadDataBrand({
                                                data: result,
                                                isReload: true
                                            });
                                        } else {
                                            _this.loadDataBrand({
                                                data: result,
                                                isRemove: true
                                            });
                                        }
                                    }
                                        break;
                                    default:
                                        break;
                                }
                            }
                                break;
                            default:
                                break;
                        }
                    }
                        break;
                    default:
                        break;
                }
            }

        };

        return _this.init();
    };

    $.fn.updateNotification = function (options) {
        let _this = this;

        let defaults = {
            target: ".notification-item.unread"
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let notification = $(".brand-navigation-bar__item[data-target=nav-bar__notifications]");
            let notifications = $(settings.target);

            // Cập nhất số
            let number = formatNoticationNumber(notifications.length, 0);
            notification
                .data("value", number.num)
                .find(".badge-danger")
                .text(number.display);

            if (notifications.length) {
                notification.find(".badge-danger").show();
            } else {
                notification.find(".badge-danger").hide();
            }

        };

        return _this.init();
    };

    $.fn.initLoadNotifications = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.loadNotifications({
                url: CONF_URL.notifications,
                success: (data) => {
                    if (!data.items.length) {
                        _this.add404({
                            target: ".notifications",
                            text: "Không có thông báo",
                            image: CONF_APP.defaults.images.notificationEmpty
                        });
                    }

                    _this.updateNotification();
                },
                reject: (error) => {
                    _this.add404({
                        target: ".notifications",
                        text: error.is,
                        image: CONF_APP.defaults.images.notificationEmpty
                    });
                }
            });
        };

        return _this.init();
    };

    $.fn.onScrollExtraNotifications = function (options) {
        let _this = this;

        let defaults = {
            target: ".notification-item",
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Kiểm tra đã load xong và còn dữ liệu
            let isLoadSuccess = true;

            _this.on("scroll", function (e) {
                e.preventDefault();

                if (isLoadSuccess) {
                    _this.checkBottomScroll({
                        target: settings.target,
                        success: () => {
                            isLoadSuccess = false;

                            // Add loading
                            let loading = $($("#tiny-chat").createLoader({
                                type: "notification",
                                color: "success"
                            }));
                            _this.append(loading);

                            let url = $(".notifications").data("next");
                            if (url) {
                                _this.loadNotifications({
                                    url,
                                    success: (data) => {
                                        isLoadSuccess = true;

                                        // Remove loading 
                                        loading.remove();

                                        // Cập nhật thông báo khi khi lấy dữ liệu mới
                                        _this.updateNotification();

                                        // Scorll ngay điểm bắt đầu load dữ liệu
                                        _this.updateScrollPreBottom({
                                            target: settings.target
                                        });
                                    },
                                    reject: (error) => {
                                        // Remove loading 
                                        loading.remove();
                                    }
                                });
                            } else {
                                // Remove loading 
                                loading.remove();

                                _this.append($("#tiny-chat").createOutOfData({ type: "notification" }));
                            }
                        },
                        reject: (error) => {
                            // TODO: không thể tải thêm
                        }
                    });
                }
            })

        };

        return _this.init();
    };

    $.fn.loadNotifications = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.getAjax({
                url: settings.url,
                params: settings.params,
                success: function (data) {
                    let notifications = $(".brand-navigation-bar__item .notifications");

                    let items = data.items;
                    for (let i = 0; i < items.length; i++) {
                        let item = items[i];

                        let noti = $($("#tiny-chat").createNotificationItem({ ...item }));
                        noti.onClickNotification({ notification_id: item.notification.id });
                        notifications.append(noti);
                    }

                    notifications.data("next", data.next_page_url);

                    if (typeof settings.success == "function") {
                        settings.success(data);
                    }
                },
                reject: function (error) {
                    if (typeof settings.reject == "function") {
                        settings.reject(error);
                    }
                }
            });
        };

        return _this.init();
    }

    $.fn.onClickNotification = function (options) {
        let _this = this;

        let defaults = {
            target: ".notifications"
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                let noti = $(this);
                if (noti.hasClass("unread")) {
                    _this.taggoleViewNotification(noti.data("id"));
                }
            });

            _this.taggoleViewNotification = (notification_id) => {
                let noti = $(`.notifications .notification-item[data-id=${notification_id}]`);
                noti.toggleClass("unread");
                if (noti.hasClass("unread")) {
                    noti
                        .find(".notification-item__action-item__view")
                        .empty()
                        .prop("title", "Đánh dấu đã xem")
                        .append(`<i class="fa-regular fa-eye"></i>`);
                } else {
                    noti
                        .find(".notification-item__action-item__view")
                        .empty()
                        .prop("title", "Đánh dấu chưa xem")
                        .append(`<i class="fa-regular fa-eye-slash"></i>`);
                }

                noti.updateNotification();
            };

            _this.successResponseNotification = (notification_id) => {
                let noti = $(`.notifications .notification-item[data-id=${notification_id}]`);
                noti.find(`.notification-item__action-item__accept`).remove();
                noti.find(`.notification-item__action-item__reject`).remove();
                noti.removeClass("unread");

                noti.updateNotification();
            };

            _this.find(".notification-item__action-item__accept").onClickResponseNotification({
                params: {
                    accept: 1,
                    id: settings.notification_id,
                },
                success: (data) => {
                    // Gửi socket
                    Chat.getInstance().sendPushNotification({
                        notification_id: data.send_notification_id
                    });

                    _this.successResponseNotification(data.notification.id);
                    _this.processNotification({ data });
                },
                reject: (error) => {
                    _this.successResponseNotification(error.notification_id);
                    _this.processNotification({ data: error });
                }
            });

            _this.find(".notification-item__action-item__reject").onClickResponseNotification({
                params: {
                    accept: 0,
                    id: settings.notification_id,
                },
                success: (data) => {
                    // Gửi socket
                    Chat.getInstance().sendPushNotification({
                        notification_id: data.send_notification_id
                    });

                    _this.successResponseNotification(data.notification.id);
                    _this.processNotification({ data });
                },
                reject: (error) => {
                    _this.successResponseNotification(error.notification_id);
                    _this.processNotification({ data: error });
                }
            });

            _this.find(".notification-item__action-item__view").on("click", function (e) {
                e.preventDefault();

                let noti = $(`.notifications .notification-item[data-id=${settings.notification_id}]`);

                _this.getAjax({
                    url: CONF_URL.notifications,
                    params: {
                        id: settings.notification_id,
                        is_seen: noti.hasClass("unread") ? 1 : 0
                    },
                    success: function (data) {
                        _this.taggoleViewNotification(data.notification_id);
                    },
                    reject: function (error) {
                    }
                });

                return false;
            });
        };

        return _this.init();
    };

    $.fn.onClickResponseNotification = function (options) {
        let _this = this;

        let defaults = {
            target: ".notifications"
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("click", function (e) {
                e.preventDefault();

                _this.postAjax({
                    url: CONF_URL.notifications,
                    params: settings.params,
                    success: function (data) {
                        if (typeof settings.success == "function") {
                            settings.success(data);
                        }
                    },
                    reject: function (error) {
                        if (typeof settings.reject == "function") {
                            settings.reject(error);
                        }
                    }
                });

                return false;
            });
        };

        return _this.init();
    };

    // $.fn.checkEmptyNotifications = function (options) {
    //     let _this = this;

    //     let defaults = {
    //     };
    //     let settings = $.extend({}, defaults, options);

    //     _this.init = function () {
    //         let chatinfoContent = $(".chat-info__content");

    //         // Chatinfo empty
    //         if (!chatinfoContent.find(".chatinfo").length) {
    //             let content = chatinfoContent.append($("#tiny-chat").createMini404());
    //             $("#tiny-chat").chatBoxInput().hide();
    //         }
    //     };

    //     return _this.init();
    // };

    $.fn.updateNotificationTime = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let contentTimes = null;

            if (_this.length) {
                contentTimes = _this;
            } else {
                contentTimes = $(".notification-item");
            }

            contentTimes = contentTimes.find(".notification-item__content-date");
            contentTimes.each((index, value) => {
                let contentTime = $(value);
                let time = contentTime.data("value");
                let upTime = getDate(time);
                contentTime.text(upTime);
            });

        };

        return _this.init();
    }
})(jQuery);
