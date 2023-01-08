import "/public/js/libraries/jquery-3.6.1.js";
import { CONF_URL } from "/public/js/config.js";

(function ($) {
    $.fn.getMembersBrand = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {

            _this.getAjax({
                url: CONF_URL.members,
                params: {
                    id: settings.id,
                    part: "brand"
                },
                success: function (data) {
                    if (typeof settings.callback == "function") {
                        settings.callback(data, null);
                    }
                },
                reject: function (error) {
                    if (typeof settings.callback == "function") {
                        settings.callback(error, null);
                    }
                }
            });
        };

        return _this.init();
    }

    $.fn.onClickMemberMenu = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.checkEmptyItem = function () {
                let members = $("#settings-member .member");

                return members.length == 0;
            };

            // Remove
            _this.find(".profile-item-menu__item-remove").on("click", function (e) {
                e.preventDefault();

                let memberID = _this.data("id");
                let brandID = _this.data("brandid");

                _this.deleteAjax({
                    url: CONF_URL.members,
                    params: {
                        id: brandID,
                        member_id: memberID,
                        part: "brand",
                    },
                    success: (data) => {
                        $(`#settings-member .member[data-id=${data.member_id}]`)
                            .slideUp("slow", function (e) {
                                $(this).remove();
                            });

                        if (_this.checkEmptyItem()) {
                            $(`#settings-member .form-content`)
                                .append(_this.createMini404({
                                    type: "member"
                                }));
                        }

                        $("#tiny-chat").showAlert({
                            type: "success",
                            content: "Xóa thành viên thành công",
                            autoClose: true,
                            name: "onClickMemberMenu"
                        });

                        // Socket remove member
                        if (data.send_notification_id) {
                            Chat.getInstance().sendPushNotification({
                                notification_id: data.send_notification_id
                            });
                        }

                        Chat.getInstance().sendRemoveBrand({
                            user_id: data.user_id,
                            id: data.brand_id
                        });
                    },
                    reject: (error) => {
                        $("#tiny-chat").showAlert({
                            type: "error",
                            content: error.is,
                            autoClose: true,
                            name: "onClickMemberMenu"
                        });
                    }
                });
            });
        };

        return _this.init();
    };

    $.fn.onClickAddMemebr = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("click", function (e) {
                e.preventDefault();

                let inputOption = $("#settings-member .option input:checked");
                let brandName = inputOption.siblings(".opt-val").text();
                let brandID = inputOption.parent(inputOption).data("id");

                let popup = $($(this).createPopup({
                    title: "Thêm thành viên",
                    content: $(this).createAddMember({
                        data: {
                            brandName,
                            brandID
                        }
                    }),
                    showAction: false
                }));

                $("#tiny-chat").append(popup);
                $("#tiny-chat").onClickPopup({
                    callbackClose: _this.callbackClose
                });

                $("#tiny-chat .popup #add-member__form").submitAddMember({
                    callbackSuccess: _this.callbackSuccess(popup)
                });
            });

            _this.callbackSuccess = function (popup) {
                return function (data) {
                    $("#tiny-chat").showAlert({
                        type: "success",
                        content: "Gửi lời mời tham gia cho thành viên thành công",
                        autoClose: true,
                        name: "callbackSuccess"
                    });

                    popup.remove();

                    // Add memeber vào danh sách với trạng thái pendding
                    let member = $($().createMemberItem({
                        data,
                        isAdmin: data.is_admin
                    }));
                    $("#settings-member .form-content").append(member);
                    $(`#settings-member .member[data-id=${data.id}]`).onClickMemberMenu();

                    // Dùng socket đây thông báo cho member
                    Chat.getInstance().sendPushNotification({
                        notification_id: data.send_notification_id
                    });
                };
            }

            _this.callbackClose = function (e) {
                let btnClose = $(e);
                btnClose.data("target");

                $("#" + btnClose.data("target")).remove();
            }
        };

        return _this.init();
    };

    $.fn.submitAddMember = function (options) {
        let _this = this;

        let defaults = {
            callbackSuccess: null
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("submit", function (e) {
                e.preventDefault();

                //Layout loading
                $(".popup-content").loadingLayout({
                    type: "water",
                    target: "add-member__form",
                });

                _this.disabledInput();
                _this.ajaxForm({
                    fields: ["mail"],
                    url: CONF_URL.members,
                    params: {
                        id: _this.find("#brandID").val(),
                        part: "brand"
                    },
                    success: function (response) {
                        _this.endabaleInput();

                        $(".popup-content").loadingLayout({
                            isShow: false,
                            target: "add-member__form",
                        });

                        if (settings.callbackSuccess && typeof settings.callbackSuccess == "function") {
                            settings.callbackSuccess(response);
                        }
                    },
                    reject: function (error) {
                        $(".popup-content").loadingLayout({
                            isShow: false,
                            target: "add-member__form",
                        });

                        _this.endabaleInput();

                        $("#tiny-chat").showAlert({
                            type: "error",
                            content: error.is,
                            autoClose: true,
                            name: "submitAddMember"
                        });

                        if (error.brand) {
                            let form = $("#add-member__form");
                            form.find("#brandName").prop("disabled", true).val(error.brand.name);
                            form.find("#brandID").val(error.brand.id);
                        } else {
                            $(".popup").remove();
                        }
                    }
                });
            })
        };

        return _this.init();
    };

})(jQuery);
