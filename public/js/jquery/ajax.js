(function ($) {
    $.fn.get = function (options) {
        let _this = this;

        let defaults = {
            url: ""
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
            data: {}
        };
        let settings = $.extend({}, defaults, options);

        _this.init = function () {
            // Nạp dữ liệu
            settings.fields.forEach(field => {
                if (field == "avatar") {
                    settings.data[field] = _this
                        .find(".review-image img[data-self=0]")
                        .prop("src");
                } else {
                    settings.data[field] = _this
                        .find("#" + field)
                        .val();
                }
            });

            // Reset nhãn lỗi
            _this.find(".label-error").text("");

            $.ajax({
                method: settings.method,
                url: settings.url,
                data: settings.data,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
            }).done(function (response) {
                if (response.isError) {
                    // Reset input
                    _this.emptyInput();

                    // Hiển thị lỗi
                    for (const [k, v] of Object.entries(response.error)) {
                        _this.find("[data-name=" + k + "]").text(v);
                    }

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
