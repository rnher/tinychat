import "/public/js/libraries/jquery-3.6.1.js";
import { CONF_URL, CONF_HOST, CONF_APP } from "/public/js/config.js";
import { getDate } from "/public/js/util.js";
import "/public/js/libraries/coloris.js";
import "/public/js/jquery/chatinfo.js";

(function ($) {
    $.fn.submitProfileBrand = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.on("submit", function (e) {
                e.preventDefault();

                let form = $(this);

                //Layout loading
                $(".settings-detail").loadingLayout({
                    type: "water",
                    target: "settings-brand",
                });

                form.ajaxForm({
                    url: CONF_URL.brands,
                    params: {
                        id: _this.data("id")
                    },
                    fields: [
                        "name",
                        "description",
                        "greeting",
                        "avatar",
                        "banner",
                        "password",
                        "domain",
                        "is_require_mail",
                        "is_require_phone",
                        "csrf"
                    ],
                    data: {
                        brand_name_color: form.find(".edit-brand-name-color").data("selectcolor"),
                        brand_text_color: form.find(".edit-brand-text-color").data("selectcolor"),
                        brand_chat_color: form.find(".edit-brand-content").data("selectcolor"),
                        brand_chat_bg: form.find(".edit-brand-content").data("selectbg"),
                        client_chat_color: form.find(".edit-customer-content").data("selectcolor"),
                        client_chat_bg: form.find(".edit-customer-content").data("selectbg"),
                        main_color: form.find(".edit-main").data("selectcolor"),
                        main_bg: form.find(".edit-main").data("selectbg"),
                        // TODO:
                        // main_text :form.find(".edit-main").data("selecttext"),
                        // main_icon :form.find(".edit-main").data("selecticon"),
                        chat_bg: form.find(".edit-chat-bg").data("selectbg"),
                    },
                    success: function (data) {
                        $(".settings-detail").loadingLayout({
                            isShow: false,
                            target: "settings-brand",
                        });

                        form.loadReLoadBrandSettings({ data });

                        if (data.is_edit_token) {
                            $("#clipboard-btn__token").trigger("click");
                        }

                        $("#tiny-chat").showAlert({
                            type: "success",
                            content: "Cập nhật thành công",
                            autoClose: true,
                            name: "submitProfileUser"
                        });
                    },
                    reject: function (error) {
                        $(".settings-detail").loadingLayout({
                            isShow: false,
                            target: "settings-brand",
                        });

                        form.loadReLoadBrandSettings({ data: error.data, isResetError: false });

                        $("#tiny-chat").showAlert({
                            type: "error",
                            content: error.is,
                            autoClose: true,
                            name: "submitProfileBrand"
                        });
                    }
                });
            });
        };

        return _this.init();
    };

    $.fn.submitCreateBrand = function (options) {
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
                    target: "create-brand__form",
                });

                _this.disabledInput();
                _this.ajaxForm({
                    fields: [
                        "name",
                        "description",
                    ],
                    url: CONF_URL.brands,
                    success: function (response) {
                        if (settings.callbackSuccess && typeof settings.callbackSuccess == "function") {
                            _this.endabaleInput();

                            $(".popup-content").loadingLayout({
                                isShow: false,
                                target: "create-brand__form",
                            });

                            settings.callbackSuccess(response);
                        } else {
                            $("#tiny-chat").go(CONF_URL.home);
                        }
                    },
                    reject: function (error) {
                        $(".popup-content").loadingLayout({
                            isShow: false,
                            target: "create-brand__form",
                        });

                        _this.endabaleInput();

                        $("#tiny-chat").showAlert({
                            type: "error",
                            content: error.is,
                            autoClose: true,
                            name: "submitCreateBrand"
                        });
                    }
                });
            })
        };

        return _this.init();
    };

    $.fn.initLoadAllBrand = function (options) {
        let _this = this;

        let defaults = {
            listBrand: $(".chat-menu__list-brand"),
            listChatinfo: $(".chat-info__content"),
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Add layout loading
            let loading = $().loadingWaterLayout();

            _this.getAjax({
                url: CONF_URL.brands,
                success: function (data) {
                    loading.hide();

                    for (let i = 0; i < data.length; i++) {
                        let brand = data[i];

                        if (i == 0) {
                            _this.getSettingsBrand({
                                id: brand.id,
                                callback: (data, error) => {
                                    let form = $("#settings-brand__form");

                                    if (data) {
                                        form.loadReLoadBrandSettings({ data });
                                        form.updateDisplayBrandSettings({ data });
                                    } else {
                                        // Layout không có dữ liệu
                                        form.add404({
                                            target: form,
                                            text: "Không có dữ liệu",
                                            image: CONF_APP.defaults.images.dataEmpty
                                        });
                                    }
                                }
                            });
                        }
                        _this.loadDataBrand({ data: brand });
                    }
                },
                reject: function (error) {
                    loading.hide();

                    // Layout không có dữ liệu settings brand
                    let settingsBrandForm = $("#settings-brand__form");
                    settingsBrandForm.add404({
                        target: settingsBrandForm,
                        text: "Không có dữ liệu",
                        image: CONF_APP.defaults.images.dataEmpty
                    });

                    let settingsMemberForm = $("#settings-member .form-content");
                    settingsMemberForm.add404({
                        target: settingsMemberForm,
                        text: "Không có dữ liệu",
                        image: CONF_APP.defaults.images.dataEmpty
                    });
                }
            });
        };

        return _this.init();
    };

    $.fn.loadDataBrand = function (options) {
        let _this = this;

        let defaults = {
            listBrand: $(".chat-menu__list-brand"),
            listChatinfo: $(".chat-info__content"),
            listChatbox: $(".chat-box__content"),
            isReload: false,
            isRemove: false
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            _this.addBrand = function (brandData, isPrepend = false) {
                // Add brand
                let settingsSelectBrand = $(".select-box");

                let optionItem = $(_this.createBrandSelectOption({ data: brandData }));
                settingsSelectBrand.find(".options").append(optionItem);
                $(`#settings-brand .option[data-id=${brandData.id}]`).onClickSelectBrand({ type: "brand" });
                $(`#settings-member .option[data-id=${brandData.id}]`).onClickSelectBrand({ type: "member" });

                if (isPrepend) {
                    settings.listBrand.prepend($("tiny-chat").createBrandItem({ data: brandData }));
                } else {
                    settings.listBrand.append($("tiny-chat").createBrandItem({ data: brandData }));
                }

                let listChatInfo = $($("tiny-chat").createListChatInfo({ data: brandData }));
                listChatInfo.onScrollExtraChatInfos();
                settings.listChatinfo.append(listChatInfo);

                settings.listChatbox.append($("tiny-chat").createListChatBoxContent({ data: brandData }));

                _this.loadChatinfos({
                    url: CONF_URL.brands,
                    params: { id: brandData.id },
                    success: (data) => {
                        // Cập nhật brand notification
                        $("#tiny-chat").updateBrandNotification({ brandID: data.brand_id })
                    },
                    reject: (error) => {
                        _this.add404({
                            target: `.chat-info__list-chatinfo[data-id=${error.brand_id}]`,
                            text: error.is,
                            image: CONF_APP.defaults.images.chatinfoEmpty
                        });
                    }
                });
            }

            _this.removeBrand = function (brandData, isRemove = false) {
                settings.listBrand.find(`.brand[data-id="${brandData.id}"]`).remove();
                settings.listChatinfo.find(`.chat-info__list-chatinfo[data-id="${brandData.id}"]`).remove();

                if (isRemove) {
                    let brandOption = $(`#settings-brand`);
                    brandOption.find(`.option[data-id="${brandData.id}"]`).remove();
                    let optionBrand = brandOption.find(`.option`).first();
                    if (optionBrand.length) {
                        optionBrand.find("input").first().trigger("click");
                    } else {
                        brandOption.find(".form-content").add404({
                            target: brandOption.find(".form-content"),
                            text: "Không có dữ liệu",
                            image: CONF_APP.defaults.images.dataEmpty
                        });
                    }

                    let memberOption = $(`#settings-member`);
                    memberOption.find(`.option[data-id="${brandData.id}"]`).remove();
                    let optionMember = memberOption.find(".option").first();
                    if (optionMember.length) {
                        optionMember.find("input").first().trigger("click");
                    } else {
                        memberOption.find(".form-content").add404({
                            target: memberOption.find(".form-content"),
                            text: "Không có dữ liệu",
                            image: CONF_APP.defaults.images.dataEmpty
                        });
                    }
                }

                let chatBoxContentList = settings.listChatbox.find(`.chat-box__content-list[data-id="${brandData.id}"]`);
                if (chatBoxContentList.is(":visible")) {
                    $(".chat-box__content").hide();
                }
                chatBoxContentList.remove();
            };

            let brandData = settings.data;
            if (brandData) {
                let brand = $(`.brand[data-id="${brandData.id}"]`);
                if (brand.length && settings.isRemove) {
                    _this.removeBrand(brandData, settings.isRemove);
                } else if (brand.length && settings.isReload) {
                    _this.removeBrand(brandData);
                    _this.addBrand(brandData);
                } else if (!settings.isRemove) {
                    _this.addBrand(brandData, true);
                }
            };
        };

        return _this.init();
    };

    $.fn.onClickExpandBrand = function (options) {
        let _this = this;

        let defaults = {
            elements: "body"
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(settings.elements).on("click", settings.selector, function (e) {
                e.preventDefault();
                let tiny_chat = $("#tiny-chat");

                let brand = $(this);

                // Kiểm tra active đã có hay chưa
                if (!brand.hasClass("active")) {
                    let brand_id = brand.data("id");

                    // Xóa tất cả active brand
                    $(".brand").removeClass("active");
                    brand.addClass("active");

                    tiny_chat.resetClickBrand({ brand_id })
                }
            })
        };

        return _this.init();
    };

    $.fn.getSettingsBrand = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {

            _this.getAjax({
                url: CONF_URL.brands,
                params: {
                    id: settings.id,
                    part: "settings"
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

    $.fn.onClickSelectBrand = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            $(".select-button, .options-view-button").on("click", function (e) {
                $(this).prop("checked", true);
            });

            _this.on("click", function (e) {
                let brand = $(this);
                let brandID = brand.data("id");

                //Layout loading
                $(".settings-detail").loadingLayout({
                    type: "water",
                    target: `settings-${settings.type}`,
                });

                switch (settings.type) {
                    case "brand": {
                        let form = $("#settings-brand__form");
                        form.hide();

                        _this.getSettingsBrand({
                            id: brandID,
                            callback: (data, error) => {
                                // Ẩn layout loading
                                $(".settings-detail").loadingLayout({
                                    isShow: false,
                                    target: `settings-${settings.type}`,
                                });

                                if (data) {
                                    // Remove layout không có dữ liệu
                                    form.show();

                                    form.add404({
                                        target: form,
                                        isEmpty: true,
                                    });

                                    form.loadReLoadBrandSettings({ data });
                                    form.updateDisplayBrandSettings({ data });
                                } else {
                                    // Layout không có dữ liệu
                                    form.add404({
                                        target: form,
                                        text: "Không có dữ liệu",
                                        image: CONF_APP.defaults.images.dataEmpty
                                    });
                                }
                            }
                        });
                    }
                        break;
                    case "member": {
                        let form = $("#settings-member .form-content");
                        form.empty();

                        _this.getMembersBrand({
                            id: brandID,
                            callback: (data, error) => {
                                // Ẩn layout loading
                                $(".settings-detail").loadingLayout({
                                    isShow: false,
                                    target: `settings-${settings.type}`,

                                });

                                if (data && data.items) {
                                    // Remove layout không có dữ liệu
                                    form.add404({
                                        target: form,
                                        isEmpty: true,
                                    });

                                    let items = data.items;
                                    for (let i = 0; i < items.length; i++) {
                                        let item = items[i];
                                        let member = $(_this.createMemberItem({
                                            data: item,
                                            isAdmin: data.is_admin
                                        }));

                                        form.append(member);
                                        $(`#settings-member .member[data-id=${item.id}]`).onClickMemberMenu();
                                    }
                                } else {
                                    // Layout không có dữ liệu
                                    form.add404({
                                        target: form,
                                        text: "Không có dữ liệu",
                                        image: CONF_APP.defaults.images.dataEmpty
                                    });
                                }
                            }
                        });
                    }
                        break;
                    default:
                        break;
                }

                $("#select-brand .options-view-button").prop("checked", false);
            });
        };

        return _this.init();
    };

    $.fn.loadReLoadBrandSettings = function (options) {
        let _this = this;

        let defaults = {
            isResetError: true
        };

        let settings = $.extend({}, defaults, options);

        _this.setImage = function (element, data, isBanner = true) {
            element.attr("data-self", "1")
                .attr("data-alt", data.name)
                .attr("data-src", data.image)
                .prop("src", data.image)
                .prop("alt", data.name)
                .show();

            element.off('click');
            element.on("click", function (e) {
                e.preventDefault();

                // element.attr("data-self", "0")
                //     .prop("src", data.imageDefault)
                //     .prop("alt", "")
                //     .hide();

                if (isBanner) {
                    $("#input-brand-banner").trigger("click");
                } else {
                    $("#input-brand-avatar").trigger("click");
                }
            });
        }

        _this.loadSettings = function (element, data) {
            // Setting
            element.find("#is_require_mail").prop("checked", 1 == data.is_require_mail);
            element.find("#is_require_phone").prop("checked", 1 == data.is_require_phone);

            element.reloadLayoutReviewChat({ data, isInit: true });
        }

        _this.loadData = function (element, data) {
            element.data("id", data.id);

            element.find("#btn__delete-brand").data("id", data.id);

            element.find("#csrf").val(data.csrf);

            element.find("#name").val(data.name);
            element.find("#description").val(data.description);
            element.find("#domain").val(data.domain);
            element.find("#greeting").val(data.greeting);

            element.find(`.label-info[for="token"]`).text("Mã của bạn hết hạn ngày : " + getDate(data.expire, true));

            if (data.domain) {
                element
                    .find("#token__input-group")
                    .show()
                    .find("#token")
                    .val(data.token);
                element.find(".label-error[data-name=token]")
                    .empty("")
                    .hide();
            } else {
                element
                    .find("#token__input-group")
                    .hide()
                    .find("#token")
                    .val("");
                element.find(".label-error[data-name=token]")
                    .text("Hãy đăng ký tên miền trang web để lấy mã nhúng.")
                    .show();
            }

            let avatar = element.find(".review-avatar-image");
            avatar.find(".btn-delete-image").remove();
            element.setImage(
                avatar.find("img"),
                {
                    brandID: data.id,
                    image: data.avatar,
                    name: data.name,
                    imageDefault: CONF_HOST + "/public/images/defaults/brand-avatar.jpg"
                },
                false
            );
            element.find(".input-avatar").off("change").changePreviewImage();

            let banner = element.find(".review-banner-image");
            banner.find(".btn-delete-image").remove();
            element.setImage(
                banner.find("img"),
                {
                    image: data.banner,
                    name: data.name,
                    imageDefault: CONF_HOST + "/public/images/defaults/brand-banner.jpg"
                },
                true
            );
            element.find(".input-banner").off("change").changePreviewImage();
        };

        _this.init = function () {
            let brand = settings.data;

            _this.onResetForm({ isResetError: settings.isResetError });
            _this.loadSettings(_this, brand);
            _this.loadData(_this, brand);

            _this.updateBrand({ data: brand });
        };

        return _this.init();
    };

    $.fn.onClickDeleteBrand = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {

            _this._deleteBrandData = function (idBrand) {
                $(`.brand[data-id="${idBrand}"]`).remove();
                $(`.chat-info__list-chatinfo[data-id="${idBrand}"]`).remove();
                let chatBoxContentList = $(`.chat-box__content-list[data-id="${idBrand}"]`);
                if (chatBoxContentList.hasClass("active")) {
                    $(".chat-box .chat-box__content").hide();
                }
                chatBoxContentList.remove();

                $(`.select-brand .option[data-id="${idBrand}"]`).remove();
                $(`.member[data-brandid="${idBrand}"]`).remove();

                let form = $("#settings-brand__form")
                form.onResetForm();
                form.find("#btn__delete-brand").data("id", "");
                form.hide();

                let inputSendMessage = $("#tiny-chat").messageTextarea();
                if (inputSendMessage.data("brand") == idBrand) {
                    inputSendMessage.data("chatinfo", "");
                    inputSendMessage.data("brand", "");
                    inputSendMessage.val("");
                }
            };

            _this.on("click", function (e) {
                e.preventDefault();

                let id = $(this).data("id");

                if (id) {
                    _this.find("input, .btn").prop('disabled', true);

                    _this.ajaxForm({
                        method: "DELETE",
                        url: CONF_URL.brands,
                        // data: {
                        //     "password": $("#settings-brand__form #password").val()
                        // },
                        params: {
                            id,
                        },
                        success: function (data) {
                            _this.find("input, .btn").prop('disabled', false);

                            // TODO: xóa thành công

                            _this._deleteBrandData(data.brand_id);

                            $("#tiny-chat").showAlert({
                                type: "success",
                                content: "Xóa thành công",
                                autoClose: true,
                                name: "onClickDeleteBrand"
                            });

                            // Socket thông báo xóa brand
                            for (let i = 0; i < data.notification_ids.length; i++) {
                                let notification_id = data.notification_ids[i];
                                let user_id = data.user_ids[i];

                                Chat.getInstance().sendPushNotification({
                                    notification_id
                                });

                                Chat.getInstance().sendRemoveBrand({
                                    user_id,
                                    id: data.brand_id
                                });
                            }
                        },
                        reject: function (error) {
                            _this.find("input, .btn").prop('disabled', false);

                            $("#tiny-chat").showAlert({
                                type: "error",
                                content: error.is,
                                autoClose: true,
                                name: "onClickDeleteBrand"
                            });

                            // $("#settings-brand__form #password").val("");
                        }
                    });
                }

            });
        };

        return _this.init();
    };

    $.fn.onClickAddBrand = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {

            _this.on("click", function (e) {
                e.preventDefault();

                let popup = $($(this).createPopup({
                    title: "Tạo thương hiệu",
                    content: $(this).createAddBrand(),
                    showAction: false
                }));

                $("#tiny-chat").append(popup);
                $("#tiny-chat").onClickPopup({
                    callbackClose: _this.callbackClose
                });

                $("#tiny-chat .popup #create-brand__form").submitCreateBrand({
                    callbackSuccess: _this.callbackSuccessCreateBrand(popup)
                });

            });

            _this.callbackSuccessCreateBrand = function (popup) {
                return function (data) {
                    let tiny_chat = $("#tiny-chat");
                    _this.loadDataBrand({ data });

                    tiny_chat.showAlert({
                        type: "success",
                        content: "Tạo kênh chat thương hiệu thành công",
                        autoClose: true,
                        name: "callbackSuccessCreateBrand"
                    });

                    popup.remove();

                    tiny_chat.find("#select-brand")
                        .find(`.option[data-id="${data.id}"]`)
                        .find("input").first()
                        .trigger("click");
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

    $.fn.updateBrandNotification = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let chatinfoListChatinfo = $(`.chat-info__list-chatinfo[data-id=${settings.brandID}]`);

            let notSeen = chatinfoListChatinfo.find(`.chatinfo[data-seen!="1"]`);
            let newMsg = chatinfoListChatinfo.find(`.chatinfo`).find(`.badge-new-msg[data-value!="0"]`);

            let brand = $(`.brand[data-id=${settings.brandID}]`);
            if (notSeen.length || newMsg.length) {
                brand.find(".brand-notification").show();
                return true;
            } else {
                brand.find(".brand-notification").hide();
            }

            return false;
        };

        return _this.init();
    };

    $.fn.updateDisplayBrandSettings = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let form = $("#settings-brand__form");
            if (settings.data.is_admin) {
                form.find("input, textarea, .review-brand-avatar-image").prop("disabled", false);
                form.find("button").show();
                form.find(".token__input-group").show();
                form.find(".password__input-group").show();
                form.find(".review-chat__input-group").show();
                form.find(".is_require_mail__input-group").show();
                form.find(".is_require_phone__input-group").show();
            } else {
                form.find("input, textarea, .review-brand-avatar-image").prop("disabled", true);
                form.find("button").hide();
                form.find(".token__input-group").hide();
                form.find(".password__input-group").hide();
                form.find(".review-chat__input-group").hide();
                form.find(".is_require_mail__input-group").hide();
                form.find(".is_require_phone__input-group").hide();
            }
        };

        return _this.init();
    };

    $.fn.onClickLayoutReviewChat = function (options) {
        let _this = this;

        let defaults = {
            color: null
        };

        let settings = $.extend({}, defaults, options);

        _this.processPickerColor = function (
            target,
            color,
            isBg = false,
            isColor = false,
            isText = false,
            isIcon = false
        ) {
            let data = {};
            let element = $(target);

            switch (target) {
                case "edit-brand-name-color": {
                    data.brand_name_color = color;
                }
                    break;
                case "edit-brand-text-color": {
                    data.brand_text_color = color;
                }
                    break;
                case "edit-brand-content": {
                    if (isBg) {
                        data.brand_chat_bg = color;
                    }

                    if (isColor) {
                        data.brand_chat_color = color;
                    }
                }
                    break;
                case "edit-customer-content": {
                    if (isBg) {
                        data.client_chat_bg = color;
                    }

                    if (isColor) {
                        data.client_chat_color = color;
                    }
                }
                    break;
                case "edit-main": {
                    if (isBg) {
                        data.main_bg = color;
                    }

                    if (isColor) {
                        data.main_color = color;
                    }

                    // TODO
                    // if (isText) {
                    //     data.main_text = color;
                    // }

                    // if (isIcon) {
                    //     data.main_icon = color;
                    // }
                }
                    break;
                case "edit-chat-bg": {
                    data.chat_bg = color;
                }
                    break;
                default:
                    break;
            }

            if (isBg) {
                element.data("selectbg", color);
            }

            if (isColor) {
                element.data("selectcolor", color);
            }

            _this.reloadLayoutReviewChat({ data, isSelect: true });
        }

        _this.resetColor = function (element, targetName, bg, color) {
            $(element).on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                _this.processPickerColor(targetName, bg, !!bg);
                _this.processPickerColor(targetName, color, false, !!color);
                // return false;
            });
        };

        _this.init = function () {
            _this.on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                $(".edit-layout-chat-popup").remove();

                let target = $(this);
                if (!$(".edit-layout-chat-popup").length) {
                    let title = target.data("title");
                    let color = target.data("selectcolor");
                    let bg = target.data("selectbg");
                    let initColor = target.data("color");
                    let initBg = target.data("bg");
                    let targetName = target.data("target");

                    let popup = $(target.createEditLayoutChatPopup({
                        title,
                        color,
                        bg,
                        isColor: !!color,
                        isBg: !!bg
                    }));
                    popup.css({
                        "top": target.position().top,
                        "margin-left": 0,
                        "display": "none"
                    });
                    _this.resetColor(
                        popup.find("#edit-layout-chat-reset-btn"),
                        targetName,
                        initBg,
                        initColor
                    );
                    $(".picker-edit-layout-review-chat").append(popup);
                    popup.slideDown();

                    if (!!color) {
                        $(".pickercolor-color").val(color);

                        Coloris({
                            parent: ".layout-review-chat",
                            el: ".pickercolor-color",
                        });
                    }

                    if (!!bg) {
                        $(".pickercolor-bg").val(bg);
                        Coloris({
                            parent: ".layout-review-chat",
                            el: ".pickercolor-bg",
                        });
                    }

                    // TODO: now change
                    document.addEventListener("coloris:pick", function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        settings.color = e.detail.color;
                        // return false;
                    });

                    $(".pickercolor-bg").on("change", (e) => {
                        e.stopPropagation();

                        _this.processPickerColor(targetName, settings.color, true, false);
                    });

                    $(".pickercolor-color").on("change", (e) => {
                        e.stopPropagation();

                        _this.processPickerColor(targetName, settings.color, false, true);
                    })
                }

                // return false;
            })
        };

        return _this.init();
    };

    $.fn.onChangeLayoutReviewChat = function (options) {
        let _this = this;

        let defaults = {
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {

        };

        return _this.init();
    };

    $.fn.reloadLayoutReviewChat = function (options) {
        let _this = this;

        let defaults = {
            isInit: false,
            isSelect: false
        };

        let settings = $.extend({}, defaults, options);

        _this.processReload = function (
            data,
            brand_name_color,
            brand_text_color,
            brand_chat_color,
            brand_chat_bg,
            client_chat_color,
            client_chat_bg,
            main_color,
            main_bg,
            // TODO:
            // main_text,
            // main_icon,
            chat_bg
        ) {
            if (data.brand_name_color) {
                brand_name_color;
            }
            if (data.brand_text_color) {
                brand_text_color;
            }

            if (data.brand_chat_color) {
                brand_chat_color;
            }
            if (data.brand_chat_bg) {
                brand_chat_bg;
            }

            if (data.client_chat_color) {
                client_chat_color;
            }
            if (data.client_chat_bg) {
                client_chat_bg;
            }

            if (data.main_color) {
                main_color;
            }
            if (data.main_bg) {
                main_bg;
            }
            // TODO
            // if (data.main_text) {
            //     main_text;
            // }
            // if (data.main_icon) {
            //     main_icon;
            // }

            if (data.chat_bg) {
                chat_bg;
            }
        }
        _this.init = function () {
            let data = settings.data;
            let review = $(".layout-review-chat");

            _this.processReload(
                data,
                review.find(".brand_name_color").css("color", data.brand_name_color),
                review.find(".brand_text_color").css("color", data.brand_text_color),
                review.find(".brand_chat_color").css("color", data.brand_chat_color),
                review.find(".brand_chat_bg").css("background-color", data.brand_chat_bg),
                review.find(".client_chat_color").css("color", data.client_chat_color),
                review.find(".client_chat_bg").css("background-color", data.client_chat_bg),
                review.find(".main_bg").css("background-color", data.main_bg),
                review.find(".main_color").css("color", data.main_color),
                // TODO:
                // review.find(".main_text").text(data.main_text),
                // review.find(".main_icon").empty().append($(data.main_icon)),
                review.find(".chat_bg").css("background-color", data.chat_bg),
            );

            if (settings.isInit) {
                _this.processReload(
                    data,
                    review.find(".edit-brand-name-color")
                        .data("color", data.brand_name_color),
                    review.find(".edit-brand-text-color")
                        .data("color", data.brand_text_color),
                    review.find(".edit-brand-content")
                        .data("color", data.brand_chat_color),
                    review.find(".edit-brand-content")
                        .data("bg", data.brand_chat_bg),
                    review.find(".edit-customer-content")
                        .data("color", data.client_chat_color),
                    review.find(".edit-customer-content")
                        .data("bg", data.client_chat_bg),
                    review.find(".edit-main")
                        .data("color", data.main_color),
                    review.find(".edit-main")
                        .data("bg", data.main_bg),
                    // TODO:
                    // review.find(".edit-main")
                    //     .data("text", data.main_text),
                    // review.find(".edit-main")
                    //     .data("icon", data.main_icon),
                    review.find(".edit-chat-bg")
                        .data("bg", data.chat_bg),
                );
            }

            if (settings.isSelect || settings.isInit) {
                _this.processReload(
                    data,
                    review.find(".edit-brand-name-color")
                        .data("selectcolor", data.brand_name_color),
                    review.find(".edit-brand-text-color")
                        .data("selectcolor", data.brand_text_color),
                    review.find(".edit-brand-content")
                        .data("selectcolor", data.brand_chat_color),
                    review.find(".edit-brand-content")
                        .data("selectbg", data.brand_chat_bg),
                    review.find(".edit-customer-content")
                        .data("selectcolor", data.client_chat_color),
                    review.find(".edit-customer-content")
                        .data("selectbg", data.client_chat_bg),
                    review.find(".edit-main")
                        .data("selectcolor", data.main_color),
                    review.find(".edit-main")
                        .data("selectbg", data.main_bg),
                    //TODO:
                    // review.find(".edit-main")
                    //     .data("selecttext", data.main_text),
                    // review.find(".edit-main")
                    //     .data("selecticon", data.main_icon),
                    review.find(".edit-chat-bg")
                        .data("selectbg", data.chat_bg),
                );
            }
        };

        return _this.init();
    };

    $.fn.updateBrand = function (options) {
        let _this = this;

        let defaults = {
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let brand = settings.data;

            let tiny_chat = $("#tiny-chat");

            let option = tiny_chat.find(`.select-brand .option[data-id="${brand.id}"]`);
            option.find(".label").text(brand.name);
            option.find(".opt-val").text(brand.name);
            option.find("img").prop("src", brand.avatar);
            option.find("img").prop("alt", brand.name);

            let brandActive = tiny_chat.find(`.brand[data-id="${brand.id}"]`);
            brandActive.find(".chat-menu__item").prop("title", brand.name);
            brandActive.find("img").prop("src", brand.avatar);
            brandActive.find("img").prop("alt", brand.name);
        };

        return _this.init();
    };
})(jQuery);
