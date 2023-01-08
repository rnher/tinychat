import "/public/js/libraries/jquery-3.6.1.js";
import { getDate, uniqId } from "/public/js/util.js";
import { CONF_HOST } from "/public/js/config.js";
import "/public/js/jquery/layout.js";
import "/public/js/jquery/create.js";

(function ($) {
    $.fn.onClickAction = function (options) {
        let _this = this;

        let defaults = {
            elements: "body"
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(settings.elements).on("click", settings.selector, function (e) {
                e.preventDefault();

                let target = $(this).data("target");
                let prevtarget = $(this).data("prevtarget");
                let action = $(this).data("action");

                switch (action) {
                    case "toggle": {
                        $("#" + prevtarget).toggle();
                        $("#" + target).slideToggle();
                        $("#tiny-chat").blurBlackground().toggle();
                    }
                        break;
                    case "show": {
                        $("." + prevtarget).hide();
                        $("#" + target).show();
                        $(this)
                            .addClass("active")
                            .siblings()
                            .removeClass("active");
                    }
                        break;
                    case "link": {
                        $("#tiny-chat").go(target);
                    }
                        break;
                    case "close": {
                        $("#" + target).slideUp("slow", function (e) {
                            $(this).remove();
                        });
                    }
                        break;
                    default:
                        break;
                }

                if (typeof settings.callback == "function") {
                    settings.callback($(this));
                }

                return false;
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

                    // Phần tử cuối
                    if (index == contentTimes.length - 1) {
                        // Cập nhật time của chatinfo
                        chatBoxView.updateMSGChatinfo({
                            id: chatBoxView.data("id"),
                            data: {
                                time,
                            }
                        });
                    }
                });
            }
        };

        return _this.init();
    }

    $.fn.go = function (url) {
        $(location).attr("href", url);
    };

    $.fn.showAlert = function (options) {
        let _this = this;

        let defaults = {
            id: uniqId(),
            autoClose: false,
            hideTimeout: 4000
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
                        currentAlert.hide("slow").remove();
                    }, settings.hideTimeout); // 1s chờ, 3s animation css
                }
            }
        };

        return _this.init();
    };

    $.fn.onResetForm = function (options) {
        let _this = this;

        let defaults = {
            id: uniqId(),
            autoClose: false,
            isResetError: true
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Nhãn lỗi
            if (settings.isResetError) {
                _this.find("label.label-error").empty();
            }
            // All input
            _this.find("input").val("");
            // Input imgae
            _this.find(".review-image").find("img")
                .prop("src", "")
                .prop("alt", "")
                .data("self", 0);
        };

        return _this.init();
    };

    $.fn.onClickClipboard = function (options) {
        let _this = this;

        let defaults = {
            content: "Đã sao chép, ctrl + V để dán",
            type: "success"
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(_this).on("click", function (e) {
                e.preventDefault();

                let target = $(this).data("target");
                let input = $("#" + target);
                input.select();
                let text = input.val();
                navigator.clipboard.writeText(text);

                $("#tiny-chat").showAlert({
                    type: settings.type,
                    content: settings.content,
                    autoClose: true,
                    name: "token-clipboard",
                    hideTimeout: 10000
                });
            });
        };

        return _this.init();
    };

    $.fn.closeAlert = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(".alert .alert-action").trigger("click");
        };

        return _this.init();
    };

    $.fn.onClickPopup = function (options) {
        let _this = this;

        let defaults = {
            callbackClose: null,
            callbackReject: null,
            callbackAccept: null,
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(".popup .popup__close-btn").on("click", function (e) {
                e.preventDefault();

                this.remove();

                if (settings.callbackClose && typeof settings.callbackClose == "function") {
                    settings.callbackClose(this);
                }
            });

            $(".popup #popup__reject-btn").on("click", function (e) {
                e.preventDefault();

                if (settings.callbackReject && typeof settings.callbackReject == "function") {
                    settings.callbackReject(this);
                }
            });

            $(".popup #popup__accept-btn").on("click", function (e) {
                e.preventDefault();

                if (settings.callbackAccept && typeof settings.callbackAccept == "function") {
                    settings.callbackAccept(this);
                }
            });
        };

        return _this.init();
    };

    $.fn.checkBottomScroll = function (options) {
        let _this = this;

        let defaults = {
            target: ""
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // chatinfo
            let chatinfos = _this.find(settings.target);
            let chatinfoHeight = $(chatinfos).first().outerHeight();

            // Tổng
            let scrollTopHieght = _this.outerHeight() + _this.scrollTop() + chatinfoHeight;
            let totalHeight = chatinfos.length * chatinfoHeight;

            if (Math.round(scrollTopHieght) >= Math.round(totalHeight) - 20) {
                if (typeof settings.success == "function") {
                    settings.success();
                }
            } else {
                if (typeof settings.reject == "function") {
                    settings.reject();
                }
            }
        };

        return _this.init();
    }

    $.fn.updateScrollPreBottom = function (options) {
        let _this = this;

        let defaults = {
            target: ""
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let extraLength = settings.extraLength;
            let currentLength = _this.find(settings.target).length;

            if (extraLength) {
                let perHeight = _this.prop("scrollHeight") / currentLength;
                let preHeight = perHeight * (currentLength - extraLength);

                _this.scrollTop(preHeight);
            }
        };

        return _this.init();
    }

    $.fn.add404 = function (options) {
        let _this = this;

        let defaults = {
            target: null,
            isEmpty: false,
            image: null
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let target = $(settings.target);

            if (settings.isEmpty) {
                target.find(".error").remove();
                target.children().show();
            } else {
                let errors = target.find(".error");
                if (!errors.length) {
                    target.children().hide();
                    target.append(target.createMini404(settings));
                }
            }
        };

        return _this.init();
    }

    $.fn.onClickOpenPopup = function (options) {
        let _this = this;

        let defaults = {
            type: null
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("click", function (e) {
                let target = $(this);
                let popup = null;

                switch (settings.type) {
                    case "edit_layout_chat": {
                        popup = createEditLayoutChatPopup()
                    }
                        break;
                    default:
                        break;
                }

                target.append(popup);
                return false;
            });
        };

        return _this.init();
    }

    $.fn.playSoundNotification = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            if (window.notificationSound) {
                let url = CONF_HOST + "/public/sounds/msg.mp3";

                switch (settings.type) {
                    case "greeting": {
                        url = CONF_HOST + "/public/sounds/greeting.mp3";
                    }
                        break;
                    case "notification": {
                        url = CONF_HOST + "/public/sounds/notification.mp3";
                    }
                        break;
                    case "msg": {
                        url = CONF_HOST + "/public/sounds/msg.mp3";
                    }
                        break;
                    case "typing": {
                        url = CONF_HOST + "/public/sounds/typing.mp3";
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

    $.fn.onClickDocument = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(document).on("click", function (e) {
                let tiny_chat = $("#tiny-chat");

                tiny_chat.find(".notifications").hide("fast");
            });
        };

        return _this.init();
    };

    $.fn.onClickSelectInout = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.find(".options .option").on("click", function (e) {
                _this.find(".options-view-button").trigger("click");
            });
        };

        return _this.init();
    };
})(jQuery);
