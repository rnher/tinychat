import { getDate, uniqId } from "/client/public/js/util.js";
import { CONF_HOST } from "/client/public/js/config.js";

(function ($) {
    $.fn.onClickAction = function (options) {
        let _this = this;

        let defaults = {
            elements: "#client-tiny-chat"
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(settings.elements).on("click", settings.selector, function (e) {
                e.preventDefault();

                let client_tiny_chat = $(settings.elements);

                let target = $(this).data("target");
                let prevtarget = $(this).data("prevtarget");
                let action = $(this).data("action");
                let value = $(this).data("value");

                switch (action) {
                    case "toggle": {
                        $("#" + prevtarget).toggle();
                        $("#" + target).toggle();
                    }
                        break;
                    case "show": {
                        $("." + prevtarget).hide();
                        $("#" + target).show();
                        $(this).addClass("active")
                            .siblings()
                            .removeClass("active");
                    }
                        break;
                    case "link": {
                        client_tiny_chat.go(target);
                    }
                        break;
                    case "close": {
                        $("#" + target).remove();

                        switch (value) {
                            case "alert": {
                                let items = $("." + value);
                                items.each(function (index, item) {
                                    let _item = $(item);
                                    _item.css(
                                        "top",
                                        (_item.height() * index + 5 * index) - _item.height() // 5px giãn cách
                                    );
                                });
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

                if (typeof settings.callback == "function") {
                    settings.callback($(this));
                }
            });
        };

        return _this.init();
    };

    $.fn.disabledInput = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.find("input, .btn").prop('disabled', true);
        };

        return _this.init();
    };

    $.fn.endabaleInput = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.find("input, .btn").prop('disabled', false);
        };

        return _this.init();
    };

    $.fn.emptyInput = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.find("input").val("");
            _this.find("label.label-error").empty();
        };

        return _this.init();
    };

    $.fn.updateMSGTime = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.createDateLabel = function (chatBoxView, currContentTime, preContentTime, currIndex) {

            // So sánh ngày thay đổi để cấp nhật lable ngày
            let dateLabel = false;

            let currDate = new Date(currContentTime.data("value"));
            if (preContentTime.length) {
                let preDate = new Date(preContentTime.data("value"));

                if (preDate.getDate() == currDate.getDate()
                    && preDate.getMonth() == currDate.getMonth()
                    && preDate.getFullYear() == currDate.getFullYear()
                ) {
                } else {
                    dateLabel = true;
                }
            } else {
                dateLabel = true;
            }

            if (dateLabel) {
                dateLabel = currDate.getDate() + "/" + parseInt(currDate.getMonth() + 1, 10) + "/" + currDate.getFullYear();

                // Add label
                chatBoxView.find(".message")
                    .eq(currIndex)
                    .before(chatBoxView.createChatBoxViewDateLabel({
                        date: dateLabel,
                        rawDate: currDate
                    }));
            }
        };

        _this.init = function () {
            let chatBoxView = $(".chat-box__view:visible");

            // if (_this.length) {
            //     chatBoxView = _this;
            // } else {
            //     chatBoxView = $(".chat-box__view:visible");
            // }

            chatBoxView.find(".chat-box-view__date-label").remove();

            let contentTimes = chatBoxView.find(".content-time");
            if (contentTimes.length) {
                contentTimes.each((index, value) => {
                    let contentTime = $(value);
                    let preContentTime = $(contentTimes[index - 1]);

                    _this.createDateLabel(chatBoxView, contentTime, preContentTime, index);

                    let time = contentTime.data("value");
                    let upTime = getDate(time, false, false);
                    contentTime.text(upTime);
                });
            }
        };

        return _this.init();
    }

    // $.fn.changePreviewImage = function (options) {
    //     let _this = this;

    //     let defaults = {
    //     };
    //     let settings = $.extend({}, defaults, options);

    //     _this.init = function () {
    //         _this.on("change", function (e) {
    //             let files = _this.prop('files');

    //             for (let i = 0; i < files.length; i++) {
    //                 let image = files[i];
    //                 let reader = new FileReader();
    //                 reader.readAsDataURL(image);

    //                 reader.onload = function (e) {
    //                     let img = {
    //                         data: e.currentTarget.result,
    //                         name: image.name,
    //                         size: image.size,
    //                         isSelf: 0
    //                     };

    //                     let reviewImage = $("img#" + _this.data("target"))
    //                         .prop("src", img.data)
    //                         .prop("alt", img.name)
    //                         .attr("data-self", img.isSelf);  // Không câp nhật được khi sử dụng data
    //                 };
    //             }
    //         });
    //     };

    //     return _this.init();
    // };

    $.fn.showError = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let error = settings.error;
            switch (error.not) {
                case "brand": {
                    $(_this)
                        .empty()
                        .append($("#client-tiny-chat").createMini404({
                            text: error.is
                        }));
                }
                    break;
                default:
                    break;
            }
        };

        return _this.init();
    };

    $.fn.showAlert = function (options) {
        let _this = this;

        let defaults = {
            id: uniqId(),
            autoClose: false
        };

        let settings = $.extend({}, defaults, options);

        _this.onClickClose = function () {
            $(".alert-action").on("click", function (e) {
                e.preventDefault();
                let target = $(this).data("target");
                let value = $(this).data("value");

                $("#" + target).remove();

                let items = $("." + value);
                items.each(function (index, item) {
                    let _item = $(item);
                    _item.css(
                        "top",
                        (_item.height() * index + 5 * index) - _item.height() // 5px giãn cách
                    );
                });
            });
        }

        _this.init = function () {
            let alerts = $(".alert");

            let isAlert = false;
            alerts.each(function (index, alert) {
                if ($(alert).data("name") == settings.name) {
                    isAlert = true;
                    return;
                }
            });

            if (!isAlert) {
                let currentAlert = $(_this.createAlert(settings));
                let heights = (alerts.length - 1) * alerts.height();

                // 5px giãn cách
                currentAlert.css("top", heights + 5 * alerts.length);
                _this.append(currentAlert);

                _this.onClickClose();

                if (settings.autoClose) {
                    setTimeout(() => {
                        currentAlert.remove();
                    }, 4000); // 1s chờ, 3s animation css
                }
            }
        };

        return _this.init();
    };

    $.fn.playSoundNotification = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            if (window.notificationSound) {
                let url = CONF_HOST + "/client/public/sounds/msg.mp3";

                switch (settings.type) {
                    case "greeting": {
                        url = CONF_HOST + "/client/public/sounds/greeting.mp3";
                    }
                        break;
                    case "notification": {
                        url = CONF_HOST + "/client/public/sounds/notification.mp3";
                    }
                        break;
                    case "msg": {
                        url = CONF_HOST + "/client/public/sounds/msg.mp3";
                    }
                        break;
                    case "typing": {
                        url = CONF_HOST + "/client/public/sounds/typing.mp3";
                    }
                        break;
                    default:
                        break;
                }

                let audio = new Audio(url);
                audio.play();
            }
        };

        return _this.init();
    };

    $.fn.onClickNotificationSound = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("click", function (e) {
                e.preventDefault();

                let noti = $(this);
                if (window.notificationSound) {
                    noti.empty().append(`<i title="Đã tắt tiếng" class="fa-regular fa-bell-slash"></i>`);
                } else {
                    noti.empty().append(`<i title="Đã bật tiếng" class="fa-regular fa-bell"></i>`);
                }

                window.notificationSound = !window.notificationSound;
            });
        };

        return _this.init();
    }

})(jQuery);
