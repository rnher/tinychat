import "/public/js/libraries/jquery-3.6.1.js";

(function ($) {
    $.fn.getAjax = function (options) {
        let _this = this;

        let defaults = {
            url: "",
            params: {}
        };

        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let url = settings.url + (settings.params ? ("?" + $.param(settings.params)) : "");

            $.get(url)
                .done(function (response) {
                    if (response.isError) {
                        if (typeof settings.reject == "function") {
                            settings.reject(response.error);
                        }
                    } else {
                        if (typeof settings.success == "function") {
                            settings.success(response.data);
                        }
                    }
                });
        };

        return _this.init();
    }

    $.fn.ajaxForm = function (options) {
        let _this = this;

        let defaults = {
            method: "POST",
            url: "",
            fields: [],
            data: {},
            params: {}
        };
        let settings = $.extend({}, defaults, options);

        _this.getData = function (settings) {
            settings.fields.forEach(field => {
                if (field == "avatar") {
                    settings.data[field] = this
                        .find(".review-avatar-image img[data-self=0]")
                        .prop("src");
                } else if (field == "banner") {
                    settings.data[field] = this
                        .find(".review-banner-image img[data-self=0]")
                        .prop("src");
                } else {
                    let input = this.find("#" + field);
                    if (input.is(":checkbox")) {
                        settings.data[field] = input.is(":checked") ? 1 : 0;
                    } else if (input.val()) {
                        settings.data[field] = input.val();
                    }
                }
            });
        }

        _this.setData = function (datas = []) {
            for (const [field, value] of Object.entries(datas)) {
                if (field == "avatar") {
                    this.find(".review-avatar-image img")
                        .data("self", 1)
                        .prop("src", value);
                } else if (field == "banner") {
                    this.find(".review-banner-image img")
                        .data("self", 1)
                        .prop("src", value);
                } else {
                    let input = this.find("#" + field);
                    if (input.is(":checkbox")) {
                        input.prop("checked", value == 1);
                    } else {
                        input.val(value);
                    }
                }
            }
        }

        _this.init = function () {
            // N???p d??? li???u
            _this.getData(settings);

            // X??a popup
            _this.find(".popup").remove();

            // Disable input
            _this.disabledInput();

            let url = settings.url + (settings.params ? ("?" + $.param(settings.params)) : "");

            $.ajax({
                method: settings.method,
                url: url,
                data: settings.data,
                dataType: "json",
            }).done(function (response) {
                if (response.isError) {
                    // Reset input
                    _this.emptyInput();
                    // Enabale input
                    _this.endabaleInput();

                    // Hi???n th??? l???i
                    for (const [k, v] of Object.entries(response.error)) {
                        _this.find("[data-name=" + k + "]").text(v);
                    }

                    // Hi???n th??? l???i d??? li???u
                    _this.setData(response.error.data);

                    if (typeof settings.reject == "function") {
                        settings.reject(response.error);
                    }
                } else {
                    // Reset input
                    _this.emptyInput();

                    // Enabale input
                    _this.endabaleInput();

                    if (typeof settings.success == "function") {
                        settings.success(response.data);
                    }
                }
            });
        };

        return _this.init();
    }

    $.fn.deleteAjax = function (options) {
        let _this = this;

        let defaults = {
            method: "DELETE",
            url: "",
            data: {},
            params: {}
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let url = settings.url + (settings.params ? ("?" + $.param(settings.params)) : "");

            $.ajax({
                method: settings.method,
                url: url,
                data: settings.data,
                dataType: "json",
            }).done(function (response) {
                if (response.isError) {
                    if (typeof settings.reject == "function") {
                        settings.reject(response.error);
                    }
                } else {
                    if (typeof settings.success == "function") {
                        settings.success(response.data);
                    }
                }
            });
        };

        return _this.init();
    }

    $.fn.postAjax = function (options) {
        let _this = this;

        let defaults = {
            method: "POST",
            url: "",
            data: {},
            params: {}
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            let url = settings.url + (settings.params ? ("?" + $.param(settings.params)) : "");

            $.ajax({
                method: settings.method,
                url: url,
                data: settings.data,
                dataType: "json",
            }).done(function (response) {
                if (response.isError) {
                    if (typeof settings.reject == "function") {
                        settings.reject(response.error);
                    }
                } else {
                    if (typeof settings.success == "function") {
                        settings.success(response.data);
                    }
                }
            });
        };

        return _this.init();
    }
})(jQuery);

