import "/public/js/libraries/jquery-3.6.1.js";
import "/public/js/jquery/ajax.js";
import { CONF_URL } from "/public/js/config.js";

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
                    fields: ["username", "name", "mail", "password", "repassword"],
                    url: settings.url,
                    success: (data) => {
                        $("#tiny-chat").go(CONF_URL.home);
                    },
                    reject: (error) => {
                        form.endabaleInput();

                        $("#tiny-chat").showAlert({
                            type: "error",
                            content: error.is,
                            autoClose: true,
                            name: "signup"
                        });
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

                        $("#tiny-chat").showAlert({
                            type: "error",
                            content: error.is,
                            autoClose: true,
                            name: "signin"
                        });
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
                    _this.find("#csrf").val(data.csrf);

                    _this.find("#username").val(data.username);
                    _this.find("#name").val(data.name);
                    _this.find("#mail").val(data.mail);

                    if (data.avatar) {
                        let avatar = _this.find(".review-avatar-image img");
                        _this.find(".review-avatar-image .btn-delete-image").remove();
                        avatar.attr("data-self", "1")
                            .attr("data-alt", data.name)
                            .attr("data-src", data.avatar)
                            .prop("src", data.avatar)
                            .prop("alt", data.name)
                            .show();

                        avatar.off('click');
                        avatar.on("click", function (e) {
                            e.preventDefault();
                            $("#input-user-avatar").trigger("click");
                        });
                    }

                    _this.find(".input-avatar").off("change").changePreviewImage();

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
                _this.find("#csrf").val(user.csrf);

                form.find("#username").prop("value", user.username);
                form.find("#username").prop("disabled", true);

                form.find("#name").prop("value", user.name);
                form.find("#mail").prop("value", user.mail);

                form.find("#newpassword").val("");
                form.find("#repassword").val("");
                form.find("#password").val("");

                // Avatar
                form.find(".review-avatar-image img").prop("src", user.avatar);
                form.find(".review-avatar-image img").prop("alt", user.name);
                form.find(".review-avatar-image img").attr("data-self", "1");
            }

            // Cập nhật hình đại diện ngoài thanh menu
            function updateMenuUser(data) {
                let menuUser = $(".chat-menu__item-main.user-avatar");
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
                        "mail",
                        "newpassword",
                        "repassword",
                        "password",
                        "avatar",
                        "csrf"
                    ],
                    success: function (data) {
                        form.endabaleInput();

                        // Cập nhật hình đại diện ngoài thanh menu
                        updateMenuUser(data);

                        reloadData(form, data);

                        $("#tiny-chat").showAlert({
                            type: "success",
                            content: "Cập nhật thành công",
                            autoClose: true,
                            name: "submitProfileUser"
                        });
                    },
                    reject: function (error) {
                        form.endabaleInput();
                        reloadData(form, error.data);

                        $("#tiny-chat").showAlert({
                            type: "error",
                            content: error.is,
                            autoClose: true,
                            name: "submitProfileUser"
                        });
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

            _this.on("click", function (e) {
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

                            if (option.length) {
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
                            if (option.length) {
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
