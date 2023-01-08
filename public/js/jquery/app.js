// libraries
import "/public/js/libraries/jquery-3.6.1.js";
import "/public/js/libraries/eocjs-newsticker.js";
import "/public/js/libraries/owl.carousel.js";

// services
import "/public/js/services/chat.js";

// jquery
import "/public/js/jquery/ajax.js";
import "/public/js/jquery/create.js";
import "/public/js/jquery/table.js";
import "/public/js/jquery/member.js";
import "/public/js/jquery/brand.js";
import "/public/js/jquery/chat.js";
import "/public/js/jquery/message.js";
import "/public/js/jquery/user.js";
import "/public/js/jquery/util.js";
import "/public/js/jquery/image.js";
import "/public/js/jquery/layout.js";
import "/public/js/jquery/chatinfo.js";
import "/public/js/jquery/notification.js";
import "/public/js/jquery/display.js";
import { CONF_URL } from "/public/js/config.js";

(function ($) {
    $.fn.initApp = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let tiny_chat = $("#tiny-chat");

            window.notificationSound = true;

            //
            // App
            //
            tiny_chat.find(".news-ticker").eocjsNewsticker({
                // // animation speed
                speed: 50,
                // // time to wait before starting
                // timeout: 1,
                // // divider between news
                divider: "***🟢***",
                // type: 'ajax',
                // source: data
            });

            //
            // Banner
            //
            let chat_box_banner = tiny_chat.find(".chat-box__banner .owl-carousel");
            chat_box_banner.owlCarousel({
                items: 1,
                autoplay: true,
                autoplayTimeout: 5000,
                loop: true,
            });

            //
            // Socket
            //
            Chat.getInstance((chat) => {
                // Init load
            });

            //
            // Brand
            //
            tiny_chat.initLoadAllBrand();
            tiny_chat.onClickExpandBrand({ selector: ".brand" });
            tiny_chat.find("#create-brand__form").submitCreateBrand();
            tiny_chat.find("#settings-brand__form").submitProfileBrand();
            tiny_chat.find("#settings-brand__form #btn__delete-brand").onClickDeleteBrand();
            // tiny_chat.find("#settings-brand .select-brand").onClickSelectBrand();
            tiny_chat.find("#settings-brand__form #clipboard-btn__token").onClickClipboard({
                content: "Mã nhúng đã được sao chép, hãy đến tên miền trang web của bạn và ctrl + V để dán mã."
            });

            //
            // Document
            //
            tiny_chat.onClickDocument();

            //
            // Init
            //
            tiny_chat.initProfile();
            tiny_chat.initLoadNotifications();

            //
            // App
            //
            tiny_chat.onClickNavigationBar();
            tiny_chat.find("#chat-menu__btn").onClickChatMenu();

            //
            // Settings
            //
            tiny_chat.find("#settings-user__form").submitProfileUser();
            tiny_chat.find("#settings-close__btn").onCloseSettings();
            tiny_chat.find(".setting-item__btn").onClickExpandSetting();
            tiny_chat.find(".settings-menu #btn__add-brand").onClickAddBrand();
            tiny_chat.find(".settings-menu #btn__add-member").onClickAddMemebr();
            tiny_chat.find(".picker-edit-layout-review-chat .picker-edit").onClickLayoutReviewChat();

            //
            // Chatinfo
            //
            tiny_chat.find("#search-chatinfo").onSearchChatInfo();
            tiny_chat.onClickExpandChatinfo({ selector: ".chatinfo" });

            //
            // Form chat
            //
            tiny_chat.find("#send-message__form").submitSendMessage();

            //
            // Notifications
            //
            tiny_chat.find(".notifications").onScrollExtraNotifications();

            //
            // Common
            //
            tiny_chat.onClickAction({ selector: ".action-btn" });
            // tiny_chat.find(".clipboard-btn").onClickClipboard();
        };

        return _this.init();
    };

    $.fn.onClickNavigationBar = function (options) {
        let _this = this;

        let defaults = {
            selector: ".brand-navigation-bar__item"
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(settings.selector).on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                let tiny_chat = $("#tiny-chat");
                tiny_chat.find(".navigation-bar-item").removeClass("active");

                let brandNavBar = $(this);

                let target = brandNavBar.data("target");
                $(target).show();

                // Nếu không ở trên tab hiện tại thì load dữ liệu mới
                // Layout loading
                $("." + target).loadingLayout({
                    type: "water",
                    target: target,
                });

                // brandNavBar.prop("disabled", true);
                brandNavBar.addClass("active");

                let popup = null;
                tiny_chat.find(".nav-bar__popup").remove();

                switch (target) {
                    case "nav-bar__upgrade": {
                        popup = $(tiny_chat.createPopup({
                            title: "Nâng cấp",
                            content: "Đang được dây dựng",
                            className: "nav-bar__popup"
                        }));
                    }
                        break;
                    case "nav-bar__manager": {
                        popup = $(tiny_chat.createPopup({
                            title: "Quản lý",
                            content: "",
                            className: "nav-bar__popup nav-bar__popup-manager"
                        }));

                        let table_manager = tiny_chat
                            .tableManager({
                                className: "table-manager"
                            });
                        table_manager.find(".table-manager__wapper").onScrollExtraTableManager();
                        popup.find(".popup-content").append(table_manager);

                        popup.loadDataTableManager({
                            url: CONF_URL.usermembers,
                            success: (data) => {
                            },
                            reject: (error) => {
                                // Layout không có dữ liệu
                                popup.add404({
                                    target: popup.find(".popup-content"),
                                    text: "Không có dữ liệu",
                                    image: CONF_APP.defaults.images.dataEmpty
                                });
                            },
                        });
                    }
                        break;
                    case "nav-bar__analyses": {
                        popup = $(tiny_chat.createPopup({
                            title: "Thống kê",
                            content: "Đang được dây dựng",
                            className: "nav-bar__popup"
                        }));
                    }
                        break;
                    case "nav-bar__home": {
                        popup = $(tiny_chat.createPopup({
                            title: "Tran chủ",
                            content: "Đang được dây dựng",
                            className: "nav-bar__popup"
                        }));
                    }
                        break;
                    // case "nav-bar__token": {
                    //     popup = $(tiny_chat.createPopup({
                    //         title: "Mã nhúng",
                    //         content: "Đang được dây dựng",
                    //         className: "nav-bar__popup"
                    //     }));
                    // }
                    //     break;
                    case "nav-bar__support": {
                        popup = $(tiny_chat.createPopup({
                            title: "Hỗ trợ",
                            content: "Đang được dây dựng",
                            className: "nav-bar__popup"
                        }));
                    }
                        break;
                    case "nav-bar__settings": {
                        tiny_chat.find("#navigation-bar-item__settings").trigger("click");
                        tiny_chat.find("#setting-item__btn-brand").trigger("click", [false]);
                        let brand_id = tiny_chat.find(".brand.active").data("id");
                        if (brand_id) {
                            tiny_chat.find("#select-brand")
                                .find(`.option[data-id="${brand_id}"]`)
                                .find("input").first()
                                .trigger("click");
                        }
                    }
                        break;
                    case "nav-bar__notifications": {
                        $(".notifications")
                            .slideToggle()
                            .updateNotificationTime();
                    }
                        break;
                    case "nav-bar__chat": {
                        popup = $(tiny_chat.createPopup({
                            title: "Chat",
                            content: "Đang được dây dựng",
                            className: "nav-bar__popup"
                        }));
                    }
                        break;
                    default:
                        break;
                }

                if (popup) {
                    tiny_chat.append(popup);

                    popup.onClickPopup({
                        callbackClose: function (e) {
                            let btnClose = $(e);
                            btnClose.data("target");

                            $("#" + btnClose.data("target")).remove();
                            tiny_chat.find(".blur-bg_layout").hide();
                        }
                    });

                    tiny_chat.find(".blur-bg_layout").show();
                }

                console.log(target);
            });
        };

        return _this.init();
    };

    $.fn.onClickChatMenu = function (options) {
        let _this = this;

        let defaults = {
            is_min: true,
            width: {
                max: "350px",
                min: "50px"
            },
            avatar: {
                hide: {
                    width: 30,
                    height: 30,
                    "margin-top": 0
                },
                show: {
                    width: 50,
                    height: 50,
                    "margin-top": -10
                }
            }
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("click", function (e) {
                e.preventDefault();

                let tiny_chat = $("#tiny-chat");
                let chat_menu = tiny_chat.find(".chat-menu");
                let chat_menu_btn = chat_menu.find("#chat-menu__btn");
                let chat_menu_title = chat_menu.find(".chat-menu__head-title");
                chat_menu_btn.empty();

                if (settings.is_min) {
                    chat_menu.animate({ width: settings.width.max });
                    chat_menu.find(".brand .info-content").show();
                    chat_menu.find(".brand .user-avatar img").css(settings.avatar.show);
                    chat_menu.find(".brand .user-avatar .brand-notification").css({
                        top: -10
                    });
                    chat_menu_btn.append(`<i class="fa-solid fa-angles-left"></i>`);
                    chat_menu_title.slideDown();
                } else {
                    chat_menu.animate({ width: settings.width.min });
                    chat_menu.find(".brand .info-content").hide();
                    chat_menu.find(".brand .user-avatar img").css(settings.avatar.hide);
                    chat_menu.find(".brand .user-avatar .brand-notification").css({
                        top: 0
                    });
                    chat_menu_btn.append(`<i class="fa-solid fa-angles-right"></i>`);
                    chat_menu_title.slideUp();
                }

                settings.is_min = !settings.is_min;
            });
        };

        return _this.init();
    };


    $.fn.onCloseSettings = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.onClickAction({
                selector: "#settings-close__btn",
                callback: function (settings) {
                    $(".setting-item__btn[data-target=settings-user]").trigger("click");
                }
            });
        };

        return _this.init();
    };

    $.fn.onClickExpandSetting = function (options) {
        let _this = this;

        let defaults = {
            selector: ".setting-item__btn",
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Mặt định ở cài đặt user
            $(".setting-item__btn[data-target=settings-user]").trigger("click");
            $(`.settings-detail #settings-user`).show();

            _this.on("click", function (e, is_fetch = true) {
                e.preventDefault();

                let setting = $(this);
                let settingTarget = setting.data("target");
                let settingsTarget = $("#settings").data("target");

                // Nếu không ở trên tab hiện tại thì load dữ liệu mới
                if (settingsTarget != settingTarget) {
                    $("#settings").data("target", settingTarget);
                    $(".settings-detail .setting").hide();
                    $(settings.selector).removeClass("active");
                    setting.addClass("active");

                    $(".setting-item__btn").find(".btn__add").hide();
                    setting.find(".btn__add").show();

                    switch (settingTarget) {
                        case "settings-user": {
                            //Layout loading
                            $(".settings-detail").loadingLayout({
                                type: "water",
                                target: settingTarget,
                            });

                            $(settings.selector).prop("disabled", true);

                            $("#settings-user__form").loadProfileUser({
                                callback: () => {
                                    $(settings.selector).prop("disabled", false);

                                    //Ẩn layout loading
                                    $(".settings-detail").loadingLayout({
                                        isShow: false,
                                        target: settingTarget
                                    });

                                    if ($("#settings").data("target") == "settings-user") {
                                        $(".settings-detail .setting").hide();
                                        $(`.settings-detail #settings-user`).show("slow");
                                    }
                                }
                            });
                        }
                            break;
                        case "settings-brand": {
                            let option = $("#settings-brand").find(`.option`).first();

                            if (is_fetch && option.length) {
                                option.find("input").first().trigger("click");
                            }

                            if ($("#settings").data("target") == "settings-brand") {
                                $(".settings-detail .setting").hide();
                                $(`.settings-detail #settings-brand`).show("slow");
                            }

                        }
                            break;
                        case "settings-member": {
                            let option = $("#settings-member").find(".option").first();
                            if (is_fetch && option.length) {
                                option.find("input").first().trigger("click");
                            }

                            if ($("#settings").data("target") == "settings-member") {
                                $(".settings-detail .setting").hide();
                                $(`.settings-detail #settings-member`).show("slow");
                            }
                        }
                            break;
                        default:
                            break;
                    }

                }
            });
        };

        return _this.init();
    };
})(jQuery);
