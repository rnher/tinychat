import { CONF_URL, CONF_HOST } from "/public/js/config.js";

(function ($) {
    $.fn.signup = function (options) {
        let _this = this;

        let defaults = {
            url: CONF_URL.signup
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.submit(function (e) {
                e.preventDefault();

                let form = $(this);

                form.disabledInput();
                form.ajaxForm({
                    fields: ["username", "name", "password", "repassword"],
                    url: settings.url,
                    success: (data) => {
                        $("#tiny-chat").go(CONF_URL.home);
                    },
                    reject: (error) => {
                        form.endabaleInput();
                    },
                });
            });

        };

        return _this.init();
    };

    $.fn.signin = function (options) {
        let _this = this;

        let defaults = {
            url: CONF_URL.signin
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.submit(function (e) {
                e.preventDefault();

                let form = $(this);

                let remember = $("#remember");
                if (remember.prop("checked")) {
                    remember.prop("value", 1);
                } else {
                    remember.prop("value", 0);
                }

                form.disabledInput();
                form.ajaxForm({
                    fields: ["username", "password", "remember"],
                    url: settings.url,
                    success: (data) => {
                        $("#tiny-chat").go(CONF_URL.home);
                    },
                    reject: (error) => {
                        form.endabaleInput();
                    }
                });
            });

        };

        return _this.init();
    };

    $.fn.loadProfileUser = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.onResetForm();

            _this.get({
                url: CONF_URL.profileUser,
                success: function (data) {
                    _this.find("#username").val(data.username);
                    _this.find("#name").val(data.name);

                    if (data.avatar) {
                        let avatar = _this.find(".review-image img");

                        avatar.attr("data-self", "1")
                            .prop("src", data.avatar)
                            .prop("alt", data.name);

                        avatar.on("click", function (e) {
                            e.preventDefault();

                            avatar.attr("data-self", "0")
                                .prop("src", CONF_HOST + "/public/images/defaults/user-avatar.jpg")
                                .prop("alt", "")
                                .hide();
                        });
                    }

                    _this.find(".input-avatar").changePreviewImage();

                    if (typeof settings.callback == "function") {
                        settings.callback(data);
                    }
                },
                reject: function (error) {
                    let content = $(".settings-detail")
                        .empty()
                        .append($("#tiny-chat").createMini404({
                            text: error.is
                        }));
                }
            });
        };

        return _this.init();
    };

    $.fn.loadProfileBrand = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.onResetForm();

            _this.get({
                url: CONF_URL.profileBrand,
                success: function (data) {
                    _this.find("#name").val(data.name);
                    _this.find("#description").val(data.description);
                    _this.find("#domain").val(data.domain);
                    _this.find("#token").val(data.token);

                    if (data.avatar) {
                        let avatar = _this.find(".review-image img");

                        avatar.attr("data-self", "1")
                            .prop("src", data.avatar)
                            .prop("alt", data.name);

                        avatar.on("click", function (e) {
                            e.preventDefault();

                            avatar.attr("data-self", "0")
                                .prop("src", CONF_HOST + "/public/images/defaults/brand-avatar.jpg")
                                .prop("alt", "")
                                .hide();
                        });
                    }

                    _this.find(".input-avatar").changePreviewImage();

                    if (typeof settings.callback == "function") {
                        settings.callback(data);
                    }
                },
                reject: function (error) {
                    let content = $(".settings-detail")
                        .empty()
                        .append($("#tiny-chat").createMini404({
                            text: error.is
                        }));
                }
            });
        };

        return _this.init();
    };

    $.fn.initProfile = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $("#settings-user__form").loadProfileUser();
            $("#settings-brand__form").loadProfileBrand();
            // $("#review-user-image").onClickChangeAvatar();
            // $("#review-brand-image").onClickChangeAvatar();
        };

        return _this.init();
    };

    $.fn.submitProfileUser = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            function reloadData(form, user) {
                form.find("#username").prop("value", user.username);
                form.find("#username").prop("disabled", true);

                form.find("#name").prop("value", user.name);

                form.find("#newpassword").val("");
                form.find("#repassword").val("");
                form.find("#password").val("");

                // Avatar
                form.find(".review-image img").prop("src", user.avatar);
                form.find(".review-image img").prop("alt", user.name);
                form.find(".review-image img").attr("data-self", "1");
            }

            // Cập nhật hình đại diện ngoài thanh menu
            function updateMenuUser(data) {
                let menuUser = $(".chat-menu__item.user-avatar");
                menuUser.prop("title", data.name);
                menuUser.find("img")
                    .prop("src", data.avatar)
                    .prop("alt", data.name);
            }

            _this.on("submit", function (e) {
                e.preventDefault();

                let form = $(this);
                form.disabledInput();

                form.ajaxForm({
                    url: CONF_URL.profileUser,
                    fields: [
                        "name",
                        "newpassword",
                        "repassword",
                        "password",
                        "avatar"
                    ],
                    success: function (data) {
                        form.endabaleInput();

                        // Cập nhật hình đại diện ngoài thanh menu
                        updateMenuUser(data);

                        reloadData(form, data);

                        // $("#tiny-chat").showAlert({
                        //     type: "success",
                        //     content: "Cập nhật thành công"
                        // });
                    },
                    reject: function (error) {
                        form.endabaleInput();
                        reloadData(form, error.data);

                        // $("#tiny-chat").showAlert({
                        //     type: "error",
                        //     content: error.is
                        // });
                    }
                });
            });
        };

        return _this.init();
    };

    $.fn.submitProfileBrand = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            function reloadData(form, brand) {
                form.find("#token").prop("value", brand.token);
                form.find("#token").prop("disabled", true);

                form.find("#name").prop("value", brand.name);
                form.find("#description").prop("value", brand.description);
                form.find("#domain").prop("value", brand.domain);

                form.find("#password").val("");

                // Avatar
                form.find(".review-image img").prop("src", brand.avatar);
                form.find(".review-image img").prop("alt", brand.name);
                form.find(".review-image img").attr("data-self", "1");
            }

            _this.on("submit", function (e) {
                e.preventDefault();

                let form = $(this);
                form.disabledInput();

                form.ajaxForm({
                    url: CONF_URL.profileBrand + "?id=-1",
                    fields: [
                        "name",
                        "description",
                        "avatar",
                        "password",
                        "domain",
                    ],
                    success: function (data) {
                        form.endabaleInput();
                        reloadData(form, data);

                        // $("#tiny-chat").showAlert({
                        //     type: "success",
                        //     content: "Cập nhật thành công"
                        // });
                    },
                    reject: function (error) {
                        form.endabaleInput();
                        reloadData(form, error.data);

                        // $("#tiny-chat").showAlert({
                        //     type: "error",
                        //     content: error.is
                        // });
                    }
                });
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
                    $("#tiny-chat").initProfile();
                }
            });
        };

        return _this.init();
    };


    $.fn.onClickSettingDetail = function (options) {
        let _this = this;

        let defaults = {
            selector: ".setting-item__btn"
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Mặt định ở cài đặt user
            $("#settings").data("target", "settings-user");

            _this.onClickAction({
                selector: settings.selector,
                callback: function (setting) {
                    let settingTarget = setting.data("target");
                    let settingsTarget = $("#settings").data("target");

                    // Nếu không ở trên tab hiện tại thì load dữ liệu mới
                    if (settingsTarget != settingTarget) {
                        //Layout loading
                        $(".settings-detail").loadingLayout({
                            isShow: true,
                            type: "water",
                            target: settingTarget,
                        });

                        $(settings.selector).prop("disabled", true);

                        switch (settingTarget) {
                            case "settings-user": {
                                $("#settings-user__form").loadProfileUser({
                                    callback: () => {
                                        $(settings.selector).prop("disabled", false);

                                        // Ẩn layout loading
                                        $(".settings-detail").loadingLayout({
                                            isShow: false,
                                            target: settingTarget
                                        });
                                    }
                                });
                            }
                                break;
                            case "settings-brand": {
                                $("#settings-brand__form").loadProfileBrand({
                                    callback: () => {
                                        $(settings.selector).prop("disabled", false);

                                        // Ẩn layout loading
                                        $(".settings-detail").loadingLayout({
                                            isShow: false,
                                            target: settingTarget
                                        });
                                    }
                                });
                            }
                                break;
                            default:
                                break;
                        }

                        $("#settings").data("target", settingTarget);
                    }
                }
            });
        };

        return _this.init();
    };

})(jQuery);
